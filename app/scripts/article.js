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

document.addEventListener("DOMContentLoaded", async function(){
    try {
        const list = await fetchData('https://sdp-campus-safety.azurewebsites.net/articles/Approved');
        const articleList = [];
        const myMap = new Map(Object.entries(list));
        for(let i = 0; i < myMap.size; i++){
            articleList.push(myMap.get(`${i}`))

        }
            
        sortList(articleList);
        console.log(articleList);
        document.querySelector("#preloader").remove();
        document.querySelector(".main-container").style.opacity = "1";
        
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

                if(articleList.length > 0){
                    for(let i = 0; i < articleList.length; i++){
                        let article = articleList[i];
                        let author = `${article.name} ${article.surname}`;
                        let hold = article.content;
                        let holder = hold.split("").slice(0, 150).join("");
                        
                        if(article.likes == 1){
                            createArticles(
                                `${article.title} <sub><small><i>${article.likes} like</i></small></sub>`,
                                author,
                                holder,
                                hold,
                                article.articleID
                            );
                        }else{    
                            createArticles(
                                `${article.title} <sub><small><i>${article.likes} likes</i></small></sub>`,
                                author,
                                holder,
                                hold,
                                article.articleID
                            );
                        }
                    }


            } else {
                // No user is signed in
                createArticles(
                    `<b>Ahh, there seems to be no articles.</b>`,
                    "If you have something in my mind, hit us up!",
                    "",
                    "",
                    0
                );
                console.log("No user is signed in");
                currentUserName = "Unknown";
                currentUserSurname = "Unknown";
                alert("Please sign in");
                window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/register.html";
            }
        }
    });
        
       
    } catch (error) {
        console.error('Error:', error);
    }
});


function sortList(list) {
    return list.sort((a, b) => b.likes - a.likes);
}

function createArticles(title, author, subtext, fullText, articleId){
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

    const likeBtn = document.createElement("button");
    likeBtn.id = "like";
    likeBtn.dataset.articleId = articleId;
    likeBtn.type = "button";
    likeBtn.style.backgroundColor = "blue"; 
    likeBtn.style.padding = "1em";
    likeBtn.textContent = "LIKE";
    likeBtn.style.color = "whitesmoke";  
    likeBtn.style.textDecoration = "none"

    let buttonsContainer = document.createElement("div");
    buttonsContainer.style.padding = "2em";
    buttonsContainer.style.margin = "1em";
    buttonsContainer.appendChild(likeBtn);

    dashboardCard.appendChild(readDiv);
    dashboardCard.appendChild(buttonsContainer);
    dashboardContent.appendChild(dashboardCard);

    document.body.appendChild(dashboardContent);

    likeBtn.addEventListener("click", (event)=>{
        fetch(`https://sdp-campus-safety.azurewebsites.net/articles/like/${event.target.dataset.articleId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        }).then(response => {
            if(response.ok){
                event.target.disabled = true;
                event.target.textContent = "LIKED";
                event.target.style.backgroundColor = "#eef100"
                
                alert("This article has been liked.");
            }else{
                console.error("Error", response.statusText);
                alert("An error has occurred");
            }
        }).catch(error =>{
            console.error("Error:", error);
        })
    })
}
