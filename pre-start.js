// pre-start.js - Sets up environment before server starts
const fs = require('fs');
const path = require('path');

console.log('Running pre-start script...');
console.log('Running pre-start configuration...');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Detect if we're in a serverless environment (Vercel, AWS Lambda, etc.)
const isServerlessEnvironment = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT;

// Create .env file from environment variables if it doesn't exist
const envPath = path.join(__dirname, '.env');

if (!isServerlessEnvironment && !fs.existsSync(envPath)) {
  console.log('Creating .env file from environment variables...');
  
  // Create content from environment variables
  const envContent = `
# Server Configuration
PORT=3000
NODE_ENV=${process.env.NODE_ENV || 'production'}

# Database
MONGODB_URI=${process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker'}
MONGO_URI=${process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker'}

# Authentication
JWT_SECRET=${process.env.JWT_SECRET || 'default-jwt-secret'}
JWT_EXPIRE=30d

# Client URL
CLIENT_URL=${process.env.CLIENT_URL || 'http://localhost:5173'}

# Stripe Configuration
STRIPE_SECRET_KEY=${process.env.STRIPE_SECRET_KEY || 'sk_test_default'}
STRIPE_PUBLISHABLE_KEY=${process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_default'}
`;

  try {
    // Write the .env file
    fs.writeFileSync(envPath, envContent);
    console.log('.env file created successfully!');
  } catch (err) {
    console.error('Error in pre-start configuration:', err);
    // Continue execution - in production we should have environment variables set
  }
} else if (isServerlessEnvironment) {
  console.log('=== Loading Environment Variables ===');
  
  // Make sure we have both MONGO_URI and MONGODB_URI
  if (process.env.MONGODB_URI && !process.env.MONGO_URI) {
    process.env.MONGO_URI = process.env.MONGODB_URI;
    console.log('Set MONGO_URI from MONGODB_URI');
  } else if (process.env.MONGO_URI && !process.env.MONGODB_URI) {
    process.env.MONGODB_URI = process.env.MONGO_URI;
    console.log('Set MONGODB_URI from MONGO_URI');
  }
  
  // If we still don't have MONGO_URI, log an error but don't fail
  if (!process.env.MONGO_URI) {
    console.log('WARNING: MONGO_URI is not defined in environment variables');
  }
} else {
  console.log('Server .env file found at:', envPath);
}

// Verify critical directories and files
console.log('\nVerifying critical files and directories:');
const criticalFiles = [
  'server.js',
  'package.json',
  'config/db.js'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`${file}: ${exists ? 'exists' : 'MISSING'}`);
});

console.log('\nPre-start configuration complete.'); 