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

document.addEventListener("DOMContentLoaded", async function (){
    try {
        if(window.localStorage.getItem('uid') === null){
            alert("You need to sign in");
            window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/register.html"
        }
        const uid = window.localStorage.getItem('uid');
        
        const user = await fetchData(`https://sdp-campus-safety.azurewebsites.net/users/${uid}`);
        if(user[0].role == "user"){
            alert("You are not authorised to be on this page");
            window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/dashboardtest.html"
        }
        
        const list = await fetchData('https://sdp-campus-safety.azurewebsites.net/articles');
        const articleList = [];
        const myMap = new Map(Object.entries(list));
        for(let i = 0; i < myMap.size; i++){
            articleList.push(myMap.get(`${i}`))
            }
            
        document.querySelector(".dashboard-container").style.display = "flex";
        document.querySelector(".dashboard-container").style.flexDirection = "column";

        document.querySelector("#preloader").remove();
        document.querySelector(".main-container").style.opacity = "1";
        
        const applyManager = await fetchData('https://sdp-campus-safety.azurewebsites.net/applications');
        console.log(applyManager);

        if(applyManager.length > 0){
            applyManager.forEach((apply)=>{
                if(apply.status == "pending"){
                    document.querySelector(".role-section").appendChild(addApplyCard(apply.firstName, apply.lastName, apply.uid, apply.applicationID));
                }
            })
        }else{
            
            let errorMsg = document.createElement("div");
            errorMsg.innerHTML = "Currently, no requests for role change.";
            errorMsg.style.margin = "10vh 10%";
            document.querySelector(".role-section").appendChild(errorMsg);
        }

        if(articleList.length > 0){
            articleList.forEach((article) => {
                if(article.status == "pending"){
                    document.querySelector(".pending-section").appendChild(addCard(article.title, article.content, article.articleID, article.status));
                }else{
                    document.querySelector(".approved-section").appendChild(addCard(article.title, article.content, article.articleID, article.status));
                }
            })
            }else{
                let errorMsg = document.createElement("div");
                errorMsg.innerHTML = "Currently, there are no articles posted"
                document.querySelector(".requests-section").appendChild(errorMsg);
            }
        } catch (error) {
            console.error('Error:', error);
        }

    const deleteB = document.querySelectorAll("#btnDelete")
    deleteB.forEach(deleteBtn => {

        deleteBtn.addEventListener("click", (event)=>{
            event.target.textContent = "LOADING...";
            const thisDiv = event.target.parentElement.parentElement;
            let thisID = event.target.dataset.articleID;
            let url =`https://sdp-campus-safety.azurewebsites.net/articles/${thisID}`;
            
            console.log(url);
            fetch(url, {
                method: 'DELETE'
            }).then(response => {
                if(response.ok){
                    thisDiv.remove();
                    console.log("This article is successfully deleted.");
                    alert("This article is successfully deleted.");
                }else{
                    console.error("Error", response.statusText);
                    alert("An error has occurred");
                    event.target.textContent = "Delete article";
                }
            }).catch(error =>{
                console.error("Error:", error);
                event.target.textContent = "Delete article";
            })
    })
})

    const rejectBtns = document.querySelectorAll("#changeReject");
    rejectBtns.forEach(rejectBtn =>{
        rejectBtn.addEventListener("click", (event)=>{
            event.target.textContent = "LOADING...";
            let userID = event.target.dataset.userID;
            let applID = event.target.dataset.applID;
            let thisDiv = event.target.parentElement.parentElement;
            let url =`https://sdp-campus-safety.azurewebsites.net/applications/${userID}`;
            
            console.log(url);
            fetch(url, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    status: "rejected",
                    applicationID: Number.parseInt(applID),
                    managerID: "GTGCINvyJIXLXglT7kxO0u4rgFn2"
                })
            }).then(response => {
                if(response.ok){
                    thisDiv.remove();
                    console.log("This user's request has been rejected.");
                    alert("This user's request has been rejected.");
                }else{
                    console.error("Error", response.statusText);
                    alert("An error has occurred");
                    event.target.textContent = "Reject role change";
                }
            }).catch(error =>{
                console.error("Error:", error);
                event.target.textContent = "Reject role change";
            })

        })
    })

    const approveBtns = document.querySelectorAll("#changeApprove");
    approveBtns.forEach(approveBtn =>{
        approveBtn.addEventListener("click", (event)=>{
            event.target.textContent = "LOADING...";
            let userID = event.target.dataset.userID;
            let applID = event.target.dataset.applID;
            let thisDiv = event.target.parentElement.parentElement;
            let url =`https://sdp-campus-safety.azurewebsites.net/applications/${userID}`;
            
            console.log(url);
            fetch(url, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    status: "accepted",
                    applicationID: Number.parseInt(applID),
                    managerID: "GTGCINvyJIXLXglT7kxO0u4rgFn2"
                })
            }).then(response => {
                if(response.ok){
                    thisDiv.remove();
                    console.log("This user is now a manager.");
                    alert("This user is now a manager.");
                }else{
                    console.error("Error", response.statusText);
                    alert("An error has occurred");
                    event.target.textContent = "Accept role change";
                }
            }).catch(error =>{
                console.error("Error:", error);
                event.target.textContent = "Accept role change";
            })

        })
    })

    const approve = document.querySelectorAll("#btnApprove");
    approve.forEach(apprBtn =>{
        apprBtn.addEventListener("click", (event) => {
            event.target.textContent = "LOADING...";
            const thisDiv = event.target.parentElement.parentElement;
            let thisID = event.target.dataset.articleID;
            let url =`https://sdp-campus-safety.azurewebsites.net/articles/approve/${thisID}`; 
            console.log(url);
        
            fetch(url, {
                method: 'PUT'
            }).then(response => {
                if (response.ok) {
                    thisDiv.querySelector("#buttonsContainer").innerHTML = "";
                    const positiveResponse = document.createElement("p");
                    positiveResponse.style.color = "green";
                    positiveResponse.style.fontSize = "20px";
                    positiveResponse.textContent = "Article can be viewed by the users.";
                    thisDiv.querySelector("#buttonsContainer").appendChild(positiveResponse);

                    console.log("This article is successfully updated.");
                    alert("This article is successfully updated.");
                } else {
                    console.error("Error", response.statusText);
                    alert("An error has occurred");
                    event.target.textContent = "Approve article";
                }
            }).catch(error => {
                console.error("Error:", error);
            });
    });
})
    
})

function addApplyCard(name, surname, userID, applicationID){
    let card = document.createElement("div");
    card.className = "dashboard-card";
    card.style.margin = "15px 10px";

    let title = document.createElement("h3");
    title.textContent = `${name} ${surname}`;
    card.appendChild(title);

    let buttonsDiv = document.createElement("div");
    buttonsDiv.id = "buttonsContainer";
    buttonsDiv.style.display = "flex";
    buttonsDiv.style.flexDirection = "row";
    buttonsDiv.style.flexWrap = "wrap";

    let rejectChange = document.createElement("button");
    rejectChange.id = "changeReject";
    rejectChange.style.display = "inline-block";
    rejectChange.style.padding = "10px 20px";
    rejectChange.style.backgroundColor = "red";
    rejectChange.style.fontWeight = "bold";
    rejectChange.style.borderRadius = "5px"
    rejectChange.style.color = "white";
    rejectChange.style.border = "none"
    rejectChange.textContent = "Reject role change";
    rejectChange.dataset.userID = userID;
    rejectChange.dataset.applID = applicationID;

    let approveChange = document.createElement("button");
    approveChange.id = "changeApprove";
    approveChange.style.padding = "10px 20px";
    approveChange.style.backgroundColor = "green";
    approveChange.style.fontWeight = "bold";
    approveChange.style.borderRadius = "5px"
    approveChange.style.color = "white";
    approveChange.style.border = "none"
    approveChange.style.marginLeft = "2em";
    approveChange.textContent = "Approve role change";
    approveChange.dataset.userID = userID;
    approveChange.dataset.applID = applicationID;

    buttonsDiv.appendChild(approveChange);
    buttonsDiv.appendChild(rejectChange);

    card.appendChild(buttonsDiv);
    return card;
}  

function addCard(articleTitle ,articleContent, articleID, articleStatus){
    let card = document.createElement("div");
    card.className = "dashboard-card";
    card.style.margin = "15px 10px";

    let title = document.createElement("h3");
    title.textContent = articleTitle;
    card.appendChild(title);

    let content = document.createElement("p");
    content.style.minWidth = "80%";
    content.style.alignContent = "center";
    content.textContent = articleContent;
    card.appendChild(content);

    let deleteArticle = document.createElement("button");
    deleteArticle.id = "btnDelete";
    deleteArticle.style.display = "inline-block";
    deleteArticle.style.padding = "10px 20px";
    deleteArticle.style.backgroundColor = "red";
    deleteArticle.style.fontWeight = "bold";
    deleteArticle.style.borderRadius = "5px"
    deleteArticle.style.color = "white";
    deleteArticle.style.border = "none"
    deleteArticle.textContent = "Delete article";

    deleteArticle.dataset.articleID = articleID;
    deleteArticle.dataset.title = articleTitle;

    let buttonsDiv = document.createElement("div");
    buttonsDiv.id = "buttonsContainer";
    buttonsDiv.style.display = "flex";
    buttonsDiv.style.flexDirection = "row";
    buttonsDiv.style.flexWrap = "wrap";
    buttonsDiv.appendChild(deleteArticle);

    let approveBtn = document.createElement("button");
        approveBtn.id = "btnApprove";
        approveBtn.style.padding = "10px 20px";
        approveBtn.style.backgroundColor = "green";
        approveBtn.style.fontWeight = "bold";
        approveBtn.style.borderRadius = "5px"
        approveBtn.style.color = "white";
        approveBtn.style.border = "none"
        approveBtn.style.marginLeft = "2em";
        approveBtn.textContent = "Approve article";

        approveBtn.dataset.articleID = articleID;
        approveBtn.dataset.title = articleTitle;
        buttonsDiv.appendChild(approveBtn);

    if(articleStatus == "approved"){
        approveBtn.style.display = "none";        
    }

    card.appendChild(buttonsDiv);
    card.style.padding = "10vh 10vw";

    return card;
}
