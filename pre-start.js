// pre-start.js - Sets up environment before server starts
const fs = require('fs');
const path = require('path');

console.log('Running pre-start configuration...');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Create .env file from environment variables if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file from environment variables...');
  
  // Create content from environment variables
  const envContent = `
# Server Configuration
PORT=3000
NODE_ENV=${process.env.NODE_ENV || 'production'}

# Database
MONGODB_URI=${process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker'}

# Authentication
JWT_SECRET=${process.env.JWT_SECRET || 'default-jwt-secret'}
JWT_EXPIRE=30d

# Client URL
CLIENT_URL=${process.env.CLIENT_URL || 'http://localhost:5173'}

# Stripe Configuration
STRIPE_SECRET_KEY=${process.env.STRIPE_SECRET_KEY || 'sk_test_default'}
STRIPE_PUBLISHABLE_KEY=${process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_default'}
`;

  // Write the .env file
  fs.writeFileSync(envPath, envContent);
  console.log('.env file created successfully!');
} else {
  console.log('.env file already exists, skipping creation');
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
  console.log(`${file}: ${fs.existsSync(filePath) ? 'exists' : 'MISSING'}`);
});

console.log('\nPre-start configuration complete.'); 