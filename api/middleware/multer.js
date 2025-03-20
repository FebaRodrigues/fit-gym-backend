// middleware/multer.js
const multer = require('multer');

// Use memory storage for serverless environment
const storage = multer.memoryStorage();

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
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