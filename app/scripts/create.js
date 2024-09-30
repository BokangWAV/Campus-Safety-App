import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
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
let userUID = 0;

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("User ID:", user.uid);
        console.log("Email:", user.email);
        console.log("Display Name:", user.displayName);
        if (user.displayName) {
            const separateDetails = user.displayName.split(" ");
            currentUserName = separateDetails[0] || "Unknown";
            currentUserSurname = separateDetails[1] || "Unknown";
            userUID = user.uid;
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

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('articleForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!currentUserName) {
            alert("You must be logged in to post an article.");
            return;
        }

        const title = document.getElementById('articleTitle').value;
        const content = document.getElementById('articleContent').value;

        const data = {
            content: content,
            title: title,
            likes: 0,
            name: currentUserName,
            surname: currentUserSurname,
            userID: userUID
        }

        console.log(JSON.stringify(data));

        // if(userUID == 0){
        //     alert("You cannot post if you are not logged in");
        // }else{
        disableButton();
        postArticles(data, userUID)
            .then(() => {
                document.getElementById('articleTitle').value = '';
                document.getElementById('articleContent').value = '';
            })
            .catch(error => {
                console.error("Error posting article:", error);
                alert("Failed to post article. Please try again.");
            })
            .finally(() => {
                enableButton();
            });
        // }
  });

})

function disableButton() {
    const button = document.querySelector("#post");
    button.disabled = true;  
    button.innerHTML = "Posted!";  
}

function enableButton() {
    const button = document.querySelector("#post");
    button.disabled = false;
    button.innerHTML = "Submit Article";
}

async function postArticles(data, uid) {
    try {
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/articles/${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'applidcation/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Article posted!");
        } else {
            // console.error("Error submitting report:", error);
            alert("Error posting articles. Please try again.");
        }
    } catch (error) {
        console.error(error);
    }

}
