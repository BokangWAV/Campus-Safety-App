const { initializeApp } = require('firebase/app')
const { getFirestore } = require('firebase/firestore');
const { getAuth, GoogleAuthProvider } = require('firebase/auth');
const { getStorage } = require('firebase/storage');


// just configuring the dotenv to work here
require('dotenv').config();
//import './node_modules/dotenv/config.js';
const dotenv = require('dotenv')
/*
const firebaseConfig = {
  apiKey: process.env.API_KEY,
    authDomain: process.env.API_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.PROCESS_BUCKET,
    messagingSenderId: "144411393779",
    appId: process.env.APP_ID,
    measurementId: "G-5BPYZE953B"
};
*/

const firebaseConfig = {
  apiKey: "AIzaSyCLDopG2959mh9Wtl3nDM0FAWZBNc3GGLo",
  authDomain: "tdkus-fcf53.firebaseapp.com",
  projectId: "tdkus-fcf53",
  storageBucket: "tdkus-fcf53.appspot.com",
  messagingSenderId: "144411393779",
  appId: "1:144411393779:web:54a4013e6da2a974b4c186",
  measurementId: "G-5BPYZE953B"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//create google instance
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

//const storage = getStorage();

// Initialize Realtime Database and get a reference to the service

module.exports = { db, auth, provider, firebaseConfig , getAuth};