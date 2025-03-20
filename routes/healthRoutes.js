const express = require('express');
const router = express.Router();

// Simple health check endpoint
router.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || '7000'
  });
});

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    mongoConnected: !!process.env.MONGODB_URI,
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    cloudinaryConfigured: !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )
  });
});

// Note: Example code was removed to prevent server crash

module.exports = router;
