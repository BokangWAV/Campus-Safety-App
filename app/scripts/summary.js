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

async function handleUser(user) {
    let currentUserName = "Unknown";
    let currentUserSurname = "Unknown";

    if (user && user.displayName) {
        const separateDetails = user.displayName.split(" ");
        currentUserName = separateDetails[0] || "Unknown";
        currentUserSurname = separateDetails[1] || "Unknown";
    }

    try {
        const list = [];
        const alertCollection = collection(db, "alerts");
        const querySnapshot = await getDocs(alertCollection);
        

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(data);
                // if (data.name === currentUserName && data.surname === currentUserSurname) {
                //     list.push(data);
                // }
                list.push(data);

            });

            console.log(list.length);

            list.forEach((alert) => {
                createHistoryAlert(alert.alert_date, alert.details);
            });
        }
    } catch (error) {
        console.error("Error fetching alerts:", error);
    }
}

function returnDate(alertDate) {
    const date = new Date(alertDate);

    const dateOptions = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);

    return `Date: ${formattedDate} Time: ${formattedTime}`;
}


document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        handleUser(user);
    });
});
