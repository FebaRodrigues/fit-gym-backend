// src/utils/serverPortDetector.js
import axios from 'axios';
import { updateServerPort } from '../api';

// Global variable to track if port detection is in progress
let portDetectionPromise = null;

// Function to get the server URL from environment variables
const getServerURL = () => {
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    return serverUrl || 'http://localhost:5050';
};

// Function to get the API URL from environment variables
const getApiURL = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    return apiUrl || 'http://localhost:5050/api';
};

// Function to detect the server port
export const detectServerPort = async () => {
    // If detection is already in progress, return the existing promise
    if (portDetectionPromise) {
        return portDetectionPromise;
    }
    
    // Create a new promise for port detection
    portDetectionPromise = new Promise(async (resolve) => {
        console.log('Server detection started...');
        
        const apiUrl = getApiURL();
        
        try {
            console.log(`Trying to connect to ${apiUrl}/health...`);
            const response = await axios.get(`${apiUrl}/health`, {
                timeout: 5000 // Increased timeout for better chance of connection
            });
            
            if (response.status === 200 || response.status === 404) {
                console.log('Server connection confirmed');
                resolve(true);
                return true;
            }
        } catch (error) {
            if (error.response) {
                console.log('Server found (got response but not 200)');
                resolve(true);
                return true;
            }
            console.log('Server not responding, but will still proceed');
        }
        
        // Always return true to allow the app to continue
        console.log('Using configured API URL from environment variables');
        resolve(true);
        return true;
    });
    
    // Reset the promise after 30 seconds to allow for fresh detection if needed
    setTimeout(() => {
        portDetectionPromise = null;
    }, 30000);
    
    // Return the promise
    return portDetectionPromise;
};

// Reset the port detection promise (useful for testing or forcing a new detection)
export const resetPortDetection = () => {
    portDetectionPromise = null;
    console.log('Server detection reset');
};

export default detectServerPort; 