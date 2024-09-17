// init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLDopG2959mh9Wtl3nDM0FAWZBNc3GGLo",
  authDomain: "tdkus-fcf53.firebaseapp.com",
  projectId: "tdkus-fcf53",
  storageBucket: "tdkus-fcf53.appspot.com",
  messagingSenderId: "144411393779",
  appId: "1:144411393779:web:54a4013e6da2a974b4c186"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
