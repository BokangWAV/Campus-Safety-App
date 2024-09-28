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

document.addEventListener("DOMContentLoaded", function() {
    let currentUserName = "";
    let currentUserSurname = "";
    let userUID = null;
    let isUser = false;

    onAuthStateChanged(auth, (user) => {
        if (user) {
            userUID = user.uid;
            if (user.displayName) {
                const separateDetails = user.displayName.split(" ");
                currentUserName = separateDetails[0] || "Unknown";
                currentUserSurname = separateDetails[1] || "Unknown";
            }
            console.log("User is signed in:", currentUserName, currentUserSurname, userUID);
            isUser = true;
        }else{
            console.log("No user is signed in");
            currentUserName = "Unknown";
            currentUserSurname = "Unknown";
        }

        const userDetails = fetchData(`https://sdp-campus-safety.azurewebsites.net/users/${userUID}`)
        userDetails.then(data => {
            if (Array.isArray(data) && data.length > 0) {
                let user = data[0];
                console.log(user);
                //console.log('Processed user data:', user);
                window.localStorage.setItem('userFirstName', user.firstName)
                window.localStorage.setItem('userLastName', user.lastName)
                window.localStorage.setItem('userAge', user.age)
                window.localStorage.setItem('userRace', user.race)
                window.localStorage.setItem('userGender', user.gender)
                window.localStorage.setItem('userPhoneNumber', user.phoneNumber)
                if(user.role == "user"){
                    buildUserPage();
                    document.getElementById("emergency").addEventListener("click", ()=>{
                        let redirected = "current.html";
                        document.location.href = `https://agreeable-forest-0b968ac03.5.azurestaticapps.net/${redirected}`;
                })
                }else{
                    buildManagerPage()
                }
            } else {
                notSignedInPage();
              console.log('No data found or data is not an array.');
            }
        })
        
    });
    
});

//DONT FORGET TO RETRIEVE THE USER DATA FROM THE DATABASE FIRST< AS WELL AS GET THE USER LOCATION

async function postAlert(userUID, data) {
    try {
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/alert/${userUID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        
    }
}

function buildUserPage(){
    document.querySelector(".dashboard-container").innerHTML = "";
    let header = document.createElement("div");
    header.classList.add("dashboard-header");
    header.innerHTML = "<h1>Welcome to the dashboard.</h1><p>Manage your safety and stay informed.</p>"
    document.querySelector(".dashboard-container").appendChild(header);
    
    //Emergency button
    const anchor = document.createElement('a');
    anchor.href = '#';
    anchor.id = 'emergency';
    anchor.className = 'dashboard_header';
    anchor.style.textDecoration = 'none';
    anchor.style.color = 'yellow';

    const div = document.createElement('div');
    div.className = 'dashboard-alert';

    const h3 = document.createElement('h3');
    h3.textContent = 'EMERGENCY!!';

    const p = document.createElement('p');
    p.textContent = 'Trigger immediate alerts for emergencies requiring attention.';

    div.appendChild(h3);
    div.appendChild(p);

    anchor.appendChild(div);

    document.querySelector(".dashboard-container").appendChild(anchor);

    //dashboard content
    const content = document.createElement("div");
    content.className = "dashboard-content";

    content.appendChild(addCard("Emergency Alerts", "Stay updated on campus alerts", "View Alerts","summary.html"));
    content.appendChild(addCard("Report an Incident", "Quickly report any safety issues", "Report Now", "reports.html"));
    content.appendChild(addCard("Safety Resources", "Access emergency contacts and tips.", "View Resources", "ai-page.html"));
    content.appendChild(addCard("Emergency Contacts", "Get in touch with security personnel", "View Contacts", "unavailable.html"));

    document.querySelector(".dashboard-container").appendChild(content);
}

function notSignedInPage(){
    document.querySelector(".dashboard-container").innerHTML = "";
    let header = document.createElement("div");
    header.classList.add("dashboard-header");
    header.innerHTML = "<h1>You are not signed in .</h1><p>If you want to use Campus Safety, <a href=\"register.html\">sign in</a>.</p>"
    document.querySelector(".dashboard-container").appendChild(header);
    
}

function buildManagerPage(){
    
    document.querySelector(".dashboard-container").innerHTML = "";
    let header = document.createElement("div");
    header.classList.add("dashboard-header");
    header.innerHTML = "<h1>Manager's dashboard.</h1><p>Manage the web app.</p>"
    document.querySelector(".dashboard-container").appendChild(header);
    
    const content = document.createElement("div");
    content.className = "dashboard-content";

    content.appendChild(addCard("Alert and report review", "Review alerts and reports", "View Alerts","current.html"));
    content.appendChild(addCard("Update Articles", "Approve and delete articles that are to appear on the user article page", "Approve articles", "request.html"));
    content.appendChild(addCard("FAQs", "Answer frequently asked questions.", "View FAQs", "managerFAQ.html"));

    document.querySelector(".dashboard-container").appendChild(content);
}

function addCard(cardTitle, cardBrief, cardAnchor, anchorLink){
    let content = document.querySelector(".dashboard-content");
    let card = document.createElement("div");
    card.className = "dashboard-card";

    let header = document.createElement("h3");
    header.textContent = cardTitle;
    card.appendChild(header);

    let brief = document.createElement("p");
    brief.textContent = cardBrief;
    card.appendChild(brief);

    let anchor = document.createElement("a");
    anchor.href = anchorLink;
    anchor.textContent = cardAnchor;
    card.appendChild(anchor);

    return card;
}
