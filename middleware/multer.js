// middleware/multer.js
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const crypto = require('crypto');

// Detect serverless environment
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT;

// Create upload directory path - use absolute path for clarity
const uploadDir = path.join(__dirname, '../public/uploads');
console.log(`Multer upload directory: ${uploadDir}`);

let storage;

if (isServerless) {
    console.log('Using memory storage for file uploads in serverless environment');
    // Use memory storage for serverless environments
    storage = multer.memoryStorage();
} else {
    // Create the upload directory if it doesn't exist (only in non-serverless env)
    if (!fs.existsSync(uploadDir)) {
        console.log(`Creating uploads directory: ${uploadDir}`);
        fs.mkdirSync(uploadDir, { recursive: true });
        
        // Set directory permissions to ensure it's writable
        try {
            fs.chmodSync(uploadDir, '755');
            console.log(`Set permissions on uploads directory to 755`);
        } catch (err) {
            console.error(`Permission error on upload directory: ${err.message}`);
        }
    }

    // Check if directory is writable
    try {
        const testFile = path.join(uploadDir, '.test-write-permission');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        console.log('Upload directory is writable');
    } catch (err) {
        console.error(`Upload directory is not writable: ${err.message}`);
    }

    // Configure disk storage for non-serverless environments
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            // Create a secure filename with original extension
            const fileExtension = path.extname(file.originalname).toLowerCase();
            const randomName = crypto.randomBytes(16).toString('hex');
            const sanitizedFilename = `${randomName}${fileExtension}`;
            
            console.log(`Generated secure filename: ${sanitizedFilename} for original file: ${file.originalname}`);
            cb(null, sanitizedFilename);
        }
    });
}

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
    // Accept only image files
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        console.log(`Accepting file: ${file.originalname} (${file.mimetype})`);
        cb(null, true);
    } else {
        console.log(`Rejecting file: ${file.originalname} (${file.mimetype})`);
        cb(new Error('Only image files (JPEG, PNG, GIF) are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    }
});

module.exports = upload;

// // middleware/multer.js
// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         console.log("Multer saving to: uploads/");
//         cb(null, "uploads/"); // Ensure this folder exists
//     },
//     filename: (req, file, cb) => {
//         const filename = Date.now() + path.extname(file.originalname);
//         console.log("Multer filename:", filename);
//         cb(null, filename);
//     },
// });

// const upload = multer({ storage });
// module.exports = upload;