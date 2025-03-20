// verify-paths.js - Helper script to check file paths during deployment
const fs = require('fs');
const path = require('path');

console.log('=== Path Verification ===');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Check if important files exist
const checkPath = (relativePath) => {
  const fullPath = path.join(process.cwd(), relativePath);
  const exists = fs.existsSync(fullPath);
  console.log(`Path ${fullPath} exists: ${exists}`);
  return exists;
};

// Check server files
console.log('\nChecking server files:');
checkPath('fitness-tracker/Server/server.js');
checkPath('fitness-tracker/Server/package.json');
checkPath('fitness-tracker/Server/vercel.json');

// Check config files
console.log('\nChecking config files:');
checkPath('fitness-tracker/Server/config/db.js');

// List directories
const listDir = (dir) => {
  try {
    const fullPath = path.join(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      console.log(`\nContents of ${fullPath}:`);
      const files = fs.readdirSync(fullPath);
      files.forEach(file => {
        console.log(`- ${file}`);
      });
    } else {
      console.log(`Directory ${fullPath} does not exist`);
    }
  } catch (err) {
    console.error(`Error listing directory ${dir}:`, err);
  }
};

// List main directories
listDir('');
listDir('fitness-tracker');
listDir('fitness-tracker/Server');

console.log('\n=== Verification Complete ==='); 