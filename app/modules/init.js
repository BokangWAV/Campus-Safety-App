import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {  getAuth, GoogleAuthProvider  } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js"
import {
  getStorage,
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js';


// just configuring the dotenv to work here
//require('dotenv').config();
//import './node_modules/dotenv/config.js';
//const dotenv = require('dotenv')

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

export { db, auth, provider, firebaseConfig , getAuth};