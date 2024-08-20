import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", async function() {
    try {
        const list = [];
        const articlesCollection = collection(db, "articles");

        const querySnapshot = await getDocs(articlesCollection);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                let author = `${doc.data().name} ${doc.data().surname}`;
                let hold = doc.data().content;
                let holder = hold.split("").slice(0, 150).join("");
                createArticles(
                    `${doc.data().title} <sub><small><i>${doc.data().views} views</i></small></sub>`,author, holder, hold);
            });
        }
    } catch (error) {
        console.log("Error:", error);
    }
});

function createArticles(title, author, subtext, fullText){
    const dashboardContent = document.createElement("div");
    dashboardContent.classList.add("dashboard-content");    

    const dashboardCard = document.createElement("div");
    dashboardCard.classList.add("dashboard-card");

    let heading = document.createElement("h3");
    heading.innerHTML = title;
    dashboardCard.appendChild(heading);

    const p = document.createElement("p");
    p.textContent = author;
    dashboardCard.appendChild(p);

    const readDiv = document.createElement("div");
    readDiv.setAttribute("id", "read");
    readDiv.textContent = subtext + "... Read More";

    dashboardCard.addEventListener("mouseover", function() {
        readDiv.textContent = fullText;
    });

    dashboardCard.addEventListener("mouseout", function() {
        readDiv.textContent = subtext + "... Read More";
    });

    dashboardCard.appendChild(readDiv);
    dashboardContent.appendChild(dashboardCard);

    document.body.appendChild(dashboardContent);
}
