var admin = require("firebase-admin");

const serviceAccount = {
  "type": process.env.CERT_TYPE,
  "project_id": process.env.CERT_PROJECT_ID,
  "private_key_id": process.env.CERT_PRIVATE_KEY_ID,
  "private_key": process.env.CERT_PRIVATE_KEY,
  "client_email": process.env.CERT_CLIENT_EMAIL,
  "client_id": process.env.CERT_CLIENT_ID,
  "auth_uri": process.env.CERT_AUTH_URI,
  "token_uri": process.env.CERT_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.CERT_AUTH_PROVIDER,
  "client_x509_cert_url": process.env.CERT_CLIENT_CERT_URL,
  "universe_domain": process.env.CERT_UNIVERSE_DOMAIN
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


const db = admin.firestore();

module.exports = { db };
