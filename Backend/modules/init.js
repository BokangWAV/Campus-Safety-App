require('dotenv').config(); // No need to specify the path when using .env


var admin = require("firebase-admin");

// Load the base64-encoded service account from environment variables
const base64EncodedServiceAccount = process.env.BASE64_ENCODED_SERVICE_ACCOUNT;

// Check if the environment variable is loaded properly
if (!base64EncodedServiceAccount) {
  throw new Error('BASE64_ENCODED_SERVICE_ACCOUNT is not defined or is empty in safety.env');
}

try {
  // Decode the base64 string to get the JSON object
  const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf-8');
  
  // Parse the JSON credentials
  const credentials = JSON.parse(decodedServiceAccount);

  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });

  console.log("Firebase Admin SDK initialized successfully");
} catch (error) {
  console.error("Error decoding or initializing Firebase Admin SDK:", error);
  throw error;
}

const db = admin.firestore();
const FieldValue = require("firebase-admin").firestore.FieldValue;

module.exports = { db, FieldValue, admin };
