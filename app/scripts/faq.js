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
let userUID = 0;


onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        window.localStorage.setItem('accessToken', user.accessToken)
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


async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    let textArea = document.createElement("textarea");
    textArea.id = "faq-textarea";
    textArea.name = "faq-textarea";
    textArea.style.resize = 'none';

    let btn = document.createElement("button");
    btn.id = "submission";
    btn.type = "button";
    btn.textContent = "Submit FAQ";
    
    const faqQuestionContainer = document.querySelector(".faq-question");
    faqQuestionContainer.appendChild(textArea);
    faqQuestionContainer.appendChild(btn);

    btn.addEventListener("click", () => {
        let value = textArea.value;

        const data = {
            question: value
        }
        
        disableButton();
        postFAQ(data, userUID)
            .then(() => {
                textArea.value = "";
                disableButton();
            })
            .catch(error => {
                console.error("Error posting FAQ:", error);
                alert("Failed to post article. Please try again.");
            })
            .finally(() => {
                enableButton();
            });

        textArea.value = "";
    });



    try {
        const list = await fetchData('https://sdp-campus-safety.azurewebsites.net/FAQs');

        const faqList = [];
        const myMap = new Map(Object.entries(list));
        
        for (let i = 0; i < myMap.size; i++) {
            faqList.push(myMap.get(`${i}`));
        }

        const faqContainer = document.querySelector(".faq-list");
        faqContainer.innerHTML = "";

        if (faqList.length > 0) {
            faqList.forEach((faq, i) => {
                if (faq.status === "display") {
                    addCard(faq.question, faq.answer, i);
                }
            });
        } else {
            faqContainer.innerHTML = "<b>No questions as of yet! Hit us up if there is something you want to ask. Remember, your safety is your priority...</b>";
        }

    } catch (error) {
        console.log("Error:", error);
    }

    
        
});
function addCard(question, answer, index){
    document.querySelector(".faq-list").innerHTML += `<div id="card"><i>${question}</i><div class="question" id=faq${index}><p>${answer}</p></div></div>`
}

function disableButton() {
    const button = document.querySelector("#submission");
    button.disabled = true;  
    button.innerHTML = "Posted!";  
}

function enableButton() {
    const button = document.querySelector("#submission");
    button.disabled = false;
    button.innerHTML = "Submit FAQ";
}


async function postFAQ(data, uid) {
    try {
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/FAQ`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("FAQ posted!");
        } else {
            // console.error("Error submitting report:", error);
            alert("Error posting FAQ. Please try again.");
        }
    } catch (error) {
        console.error(error);
    }

}

module.exports = { fetchData, postFAQ, addCard, disableButton, enableButton };
