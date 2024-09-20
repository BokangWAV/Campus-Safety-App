var admin = require("firebase-admin");


const base64EncodedServiceAccount = process.env.BASE64_ENCODED_SERVICE_ACCOUNT;
const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf-8');
const credentials = JSON.parse(decodedServiceAccount);


admin.initializeApp({
  credential: admin.credential.cert(credentials),
});


const db = admin.firestore();

var FieldValue = require("firebase-admin").firestore.FieldValue;

module.exports = { db, FieldValue };
