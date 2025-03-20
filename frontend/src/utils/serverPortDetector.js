// src/utils/serverPortDetector.js
// This is a dummy version that doesn't actually connect to localhost

// Get API URL from environment variables - NEVER use localhost in production
const isProduction = window.location.hostname !== 'localhost';
const API_URL = isProduction 
  ? (import.meta.env.VITE_API_URL || 'https://fit-gym-backend.vercel.app/api') 
  : 'http://localhost:5050/api';

// Global variable to track if port detection is in progress
let portDetectionPromise = null;

// Function that does nothing but resolve immediately
export const detectServerPort = async () => {
    // If detection is already in progress, return the existing promise
    if (portDetectionPromise) {
        return portDetectionPromise;
    }
    
    // Create a new promise that resolves immediately
    portDetectionPromise = new Promise(async (resolve) => {
        console.log('Server connection - Using environment variables in production');
        resolve(true);
    });
    
    return portDetectionPromise;
};

// Reset function that does nothing
export const resetPortDetection = () => {
    portDetectionPromise = null;
    console.log('Port detection reset - This is a no-op in production');
};

export default detectServerPort; 