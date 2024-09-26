import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
  
const firebaseConfig = {
    apiKey: "AIzaSyCLDopG2959mh9Wtl3nDM0FAWZBNc3GGLo",
    authDomain: "tdkus-fcf53.firebaseapp.com",
    projectId: "tdkus-fcf53",
    storageBucket: "tdkus-fcf53.appspot.com",
    messagingSenderId: "144411393779",
    appId: "1:144411393779:web:54a4013e6da2a974b4c186",
    measurementId: "G-5BPYZE953B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUserName = "";
let currentUserSurname = "";

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.displayName) {
            const separateDetails = user.displayName.split(" ");
            currentUserName = separateDetails[0] || "Unknown";
            currentUserSurname = separateDetails[1] || "Unknown";
        }
        console.log("First Name:", currentUserName);
        console.log("Surname:", currentUserSurname);
    } else {
        // No user is signed in
        console.log("No user is signed in");
        currentUserName = "Unknown";
        currentUserSurname = "Unknown";
    }
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("emergency").addEventListener("click", postAlert);
});

async function postAlert() {
    const alertCollection = collection(db, 'alert');
    const data = {
        details: "EMERGENCY",
        alert_no: 1,
        surname: currentUserSurname,
        name: currentUserName,
        alert_date: new Date().toISOString(),
    };
    await addDoc(alertCollection, data)
        .then((docRef) => {
            console.log('Document written with ID: ', docRef.id);
            alert(`${currentUserName} ${currentUserSurname} needs help urgently!!!!`);
        })
        .catch((error) => {
            console.error('Error adding document:', error);
        });
}
