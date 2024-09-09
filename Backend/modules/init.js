var admin = require("firebase-admin");

var serviceAccount = require(process.env.CERT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const db = admin.firestore();

module.exports = { db };
