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
    const main = document.getElementById("main");
    const usersList = document.getElementById("usersList");

    main.innerHTML += "My current users:";

    try {
        const usersCollection = collection(db, "users");

        const querySnapshot = await getDocs(usersCollection);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${doc.data().name} ${doc.data().surname}`;
                usersList.appendChild(listItem);
            });
        } else {
            usersList.innerHTML = "<li>No users found</li>";
        }
    } catch (error) {
        console.error("Error fetching documents: ", error);
        usersList.innerHTML = "<li>Error fetching users</li>";
    }
});
