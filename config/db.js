// config/db.js

const mongoose = require('mongoose');

// Cache the database connection
let cachedDb = null;

const connectDB = async () => {
   try {
        // If we already have a connection, use it
        if (cachedDb && mongoose.connection.readyState === 1) {
            console.log('Using cached database connection');
            return;
        }
        
        // Check for both environment variable names to ensure compatibility
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        
        if (!mongoUri) {
            throw new Error('Neither MONGO_URI nor MONGODB_URI is defined in environment variables');
        }
        
        // Set both environment variables to ensure consistency
        if (!process.env.MONGO_URI && process.env.MONGODB_URI) {
            process.env.MONGO_URI = process.env.MONGODB_URI;
            console.log('Set MONGO_URI from MONGODB_URI');
        } else if (process.env.MONGO_URI && !process.env.MONGODB_URI) {
            process.env.MONGODB_URI = process.env.MONGO_URI;
            console.log('Set MONGODB_URI from MONGO_URI');
        }
        
        // Set mongoose options for better connection handling
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
            connectTimeoutMS: 10000,         // Connection timeout
            socketTimeoutMS: 45000,          // Socket timeout
        };
        
        // Display connection details (with sensitive parts masked)
        const maskedUri = mongoUri.replace(/(mongodb\+srv:\/\/)([^:]+):([^@]+)@/, '$1$2:****@');
        console.log('=== MongoDB Connection Details ===');
        console.log(`Connection URI: ${maskedUri}`);
        console.log(`Connection Options: ${JSON.stringify(options, null, 2)}`);
        
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoUri, options);
        cachedDb = mongoose.connection;
        
        // Display more detailed connection information after successful connection
        if (mongoose.connection.readyState === 1) {
            try {
                const dbName = mongoose.connection.db.databaseName;
                console.log('=== MongoDB Connection Successful ===');
                console.log(`Connected to database: ${dbName}`);
                console.log(`Connection state: Connected`);
                console.log('MongoDB connection established');
            } catch (err) {
                console.log('MongoDB connection established, but could not retrieve database name');
            }
        }
        
        // Drop the problematic index on the payments collection
        try {
            const db = mongoose.connection.db;
            const collections = await db.listCollections({ name: 'payments' }).toArray();
            
            if (collections.length > 0) {
                console.log('Checking for problematic index on payments collection...');
                const indexes = await db.collection('payments').indexes();
                const hasTransactionIdIndex = indexes.some(index => index.name === 'transactionId_1');
                
                if (hasTransactionIdIndex) {
                    console.log('Dropping problematic index on payments collection...');
                    await db.collection('payments').dropIndex('transactionId_1');
                    console.log('Successfully dropped index transactionId_1');
                } else {
                    console.log('Index transactionId_1 not found, no need to drop');
                }
            } else {
                console.log('Payments collection not found, no need to drop index');
            }
        } catch (indexError) {
            // If the index doesn't exist, that's fine
            if (indexError.code !== 27) {
                console.warn('Warning: Failed to drop index:', indexError.message);
            } else {
                console.log('Index transactionId_1 does not exist, no need to drop');
            }
        }
    } catch (error) {
        console.error('MongoDB Atlas connection failed:', error.message);
        
        // Provide more detailed error messages based on error type
        if (error.name === 'MongoServerSelectionError') {
            console.error('Could not connect to any MongoDB server. Please check:');
            console.error('1. Your network connection');
            console.error('2. MongoDB Atlas cluster status');
            console.error('3. IP whitelist settings in MongoDB Atlas');
        } else if (error.name === 'MongoParseError') {
            console.error('Invalid MongoDB connection string. Please check your MONGO_URI in .env file.');
        } else if (error.name === 'MongoNetworkError') {
            console.error('Network error connecting to MongoDB. Please check your internet connection.');
        } else if (error.message.includes('Authentication failed')) {
            console.error('MongoDB authentication failed. Please check your username and password in the connection string.');
        }
        
        // Don't exit the process, just log the error
        // process.exit(1);
    }
};

// Add a listener for MongoDB connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
    cachedDb = null;
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB connection disconnected');
    cachedDb = null;
});

// Handle application termination
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
});

module.exports = connectDB;

