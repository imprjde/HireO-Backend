// import admin from "firebase-admin";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// const serviceAccount = require("./firebaseAdminSDK.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export default admin;

import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  }),
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
});
export default admin;
