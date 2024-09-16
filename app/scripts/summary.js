import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
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
        // User is signed in
        console.log("User ID:", user.uid);
        console.log("Email:", user.email);
        console.log("Display Name:", user.displayName);
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

function createHistoryAlert(alertDate, details) {
    const dashboardContent = document.createElement("div");
    dashboardContent.classList.add("dashboard-content");

    const dashboardCard = document.createElement("div");
    dashboardCard.classList.add("dashboard-card");

    const heading = document.createElement("h3");
    heading.textContent = returnDate(alertDate);
    dashboardCard.appendChild(heading);

    const p = document.createElement("p");
    p.innerHTML = `<b>Degree of alert:</b> Emergency`;
    dashboardCard.appendChild(p);

    const readDiv = document.createElement("div");
    readDiv.textContent = details;

    dashboardCard.appendChild(readDiv);
    dashboardContent.appendChild(dashboardCard);

    document.querySelector(".dashboard-container").appendChild(dashboardContent);
}


function createHistoryReport(reportDate, details, location) {
    const dashboardContent = document.createElement("div");
    dashboardContent.classList.add("dashboard-content");

    const dashboardCard = document.createElement("div");
    dashboardCard.classList.add("dashboard-card");

    const heading = document.createElement("h3");

    const timestampInMilliseconds = reportDate[0] * 1000 + reportDate[1] / 1000;
    const date = new Date(timestampInMilliseconds);
    
    heading.textContent = date.toString();
    dashboardCard.appendChild(heading);

    const p = document.createElement("p");
    p.innerHTML = `<b>Degree of alert:</b> Incident <br> <b>Report location:</b> ${location}`;
    dashboardCard.appendChild(p);

    const readDiv = document.createElement("div");
    readDiv.textContent = details;

    dashboardCard.appendChild(readDiv);
    dashboardContent.appendChild(dashboardCard);

    document.querySelector(".dashboard-container").appendChild(dashboardContent);
}

function returnDate(alertDate) {
    const date = new Date(alertDate);

    const dateOptions = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

    return `Date: ${formattedDate} Time: ${formattedTime}`;
}

document.addEventListener("DOMContentLoaded", async ()=>{
    try {
        const list = [];
        const reportList = [];
        const finalList = [];
        const alertCollection = collection(db, "alert");
        const querySnapshot = await getDocs((alertCollection));

        if(!querySnapshot.empty){
            querySnapshot.forEach((doc) => {
                list.push(doc.data());
            })
        }

        const requestCollection = collection(db, "reports");
        const secQuerSnap = await getDocs((requestCollection));

        if(!secQuerSnap.empty){
            secQuerSnap.forEach((doc) => {
                list.push((doc.data()));
            })
        }
        console.log(list);

        list.forEach((alert) => {
            if(alert.name == currentUserName && alert.surname == currentUserSurname){
                finalList.push(alert);
            }else if(alert.userName == currentUserName && alert.userSurname == currentUserSurname){
                finalList.push(alert);
            }
        })


        if(finalList.length > 0){
            finalList.forEach((alert) =>{
                if(alert.userName == currentUserName){
                    let sec = alert.timestamp.seconds;
                    let nanosec = alert.timestamp.nanoseconds;
                    createHistoryReport([sec, nanosec], alert.description, alert.location);    
                }else{
                createHistoryAlert(alert.alert_date, alert.details);
                }
            })
        }else{
            document.querySelector(".dashboard-content").style.fontSize = "30px";
            document.querySelector(".dashboard-content").style.fontSize = "30px";
            document.querySelector(".dashboard-content").style.boxShadow = "0 14px 18px rgba(12, 255, 100, 0.1)";
            document.querySelector(".dashboard-content").style.padding = "30px";
            document.querySelector(".dashboard-content").textContent = ""
            document.querySelector(".dashboard-content").textContent += "Campus must be safe, hey? No alerts for you..."
        }

        
    } catch (error) {
        console.error("Error fetching alerts:", error);  
    }
})
