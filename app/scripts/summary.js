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

const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let currentUserName = "";
let currentUserSurname = "";
let userUID = null;

document.addEventListener("DOMContentLoaded", ()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.localStorage.setItem('accessToken', user.accessToken)
            userUID = user.uid;
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
            console.log("No user is signed in");
            currentUserName = "Unknown";
            currentUserSurname = "Unknown";
            displayNotPermittedMessage();
            alert("Please sign in...");
            window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/register.html"
        }
    });
    setTimeout(retrieveData, 2000);
})
        
async function retrieveData(){
    console.log("Fetching data...");
    const list = await fetchData(`https://sdp-campus-safety.azurewebsites.net/alert/${userUID}`);
    const reportList = await fetchData(`https://sdp-campus-safety.azurewebsites.net/reports/${userUID}`);
    document.querySelector("#preloader").remove();
    document.querySelector(".main-container").style.opacity = "1";


    console.log(list);
    console.log(reportList);

    if(list !== undefined && reportList !== undefined){
        if(list.length + reportList.length > 0){
            if(list.length != 0){
                const alertContainer = document.createElement("div");
                alertContainer.className = "alert-container";
                const alertHeader = document.createElement("h2");
                alertHeader.textContent = "Previous Alerts";

                alertContainer.appendChild(alertHeader);
                const innerContainer = document.createElement('div');
                innerContainer.id = "innerContainer";

                list.forEach(alert => {
                    createHistoryAlert(innerContainer, alert.alertDate, alert.status);
                });
                alertContainer.appendChild(innerContainer);
                document.querySelector(".dashboard-content").appendChild(alertContainer);
            }

            if(reportList.length != 0){
                const reportContainer = document.createElement("div");
                reportContainer.className = "report-container";
                const reportHeader = document.createElement("h2");
                reportHeader.textContent = "Previous Reports";

                reportContainer.appendChild(reportHeader);
                const innerContainer = document.createElement('div');
                innerContainer.id = "innerContainer";

                reportList.forEach(report => {
                    createHistoryReport(innerContainer, report.timestamp, report.description, report.location);
                });
                reportContainer.appendChild(innerContainer);
                document.querySelector(".dashboard-content").appendChild(reportContainer);
            }
        } else {
            displayNoAlertsMessage();
            }
    }else{
        displayErrorMessage();
    }
}

function createHistoryAlert(container, alertDate, articleStatus) {
    const dashboardCard = document.createElement("div");
    dashboardCard.classList.add("dashboard-card");

    const heading = document.createElement("h3");
    const timestampInMilliseconds = alertDate._seconds * 1000 + alertDate._nanoseconds / 1000000;
    const date = new Date(timestampInMilliseconds);

    heading.textContent = `${date.getDate()} ${monthName[date.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    dashboardCard.appendChild(heading);
    
    const p = document.createElement("p");
    p.innerHTML = `<b>Degree of alert:</b> Emergency alert`;
    dashboardCard.appendChild(p);

    const status = document.createElement("p");
    if(articleStatus == "ASSISTED"){
        status.innerHTML = `Final status:<b style="color: green;">Assisted</b>`;
    }else{
        status.innerHTML = `Final status:<b style="color: red;">To be assisted</b>`;
    }
    

    dashboardCard.appendChild(status);

    container.appendChild(dashboardCard);
}

function createHistoryReport(reportContainer, reportDate, description, location) {

    const dashboardCard = document.createElement("div");
    dashboardCard.classList.add("dashboard-card");

    const heading = document.createElement("h3");
    const timestampInMilliseconds = reportDate._seconds * 1000 + reportDate._nanoseconds / 1000000;
    const date = new Date(timestampInMilliseconds);

    heading.textContent = `${date.getDate()} ${monthName[date.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    dashboardCard.appendChild(heading);

    const p = document.createElement("p");
    p.innerHTML = `<b>Degree of alert:</b> Incident <br> <b>Report location:</b> ${location}`;
    dashboardCard.appendChild(p);

    const readDiv = document.createElement("div");
    readDiv.textContent = description;
    dashboardCard.appendChild(readDiv);

    reportContainer.appendChild(dashboardCard);
}

async function fetchData(url) {
    try {
        const token = window.localStorage.getItem('accessToken');
        const uid = window.localStorage.getItem('uid');
        const response = await fetch(url, {
          method: 'GET',
          headers: {
              userid:uid,
              authtoken: token,
            'Content-Type': 'application/json',
          }
        })
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayNotPermittedMessage() {
    const content = document.querySelector(".dashboard-content");
    content.style.fontSize = "30px";
    content.style.boxShadow = "0 14px 18px rgba(12, 255, 100, 0.1)";
    content.style.padding = "30px";
    content.textContent = "HEY! You are not permitted here... GO REGISTER AND LOGIN!";
}

function displayErrorMessage() {
    const content = document.querySelector(".dashboard-content");
    content.style.fontSize = "30px";
    content.style.boxShadow = "0 14px 18px rgba(12, 255, 100, 0.1)";
    content.style.padding = "30px";
    content.textContent = "Unfortunately, we are unable to retrieve data from our server. Try again later...";
}

function displayNoAlertsMessage() {
    const content = document.querySelector(".dashboard-content");
    content.style.fontSize = "30px";
    content.style.boxShadow = "0 14px 18px rgba(12, 255, 100, 0.1)";
    content.style.padding = "30px";
    content.textContent = "Campus must be safe, hey? No alerts for you...";
}
