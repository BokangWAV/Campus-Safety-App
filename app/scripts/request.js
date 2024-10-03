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
        const list = await fetchData('https://sdp-campus-safety.azurewebsites.net/articles');
        const articleList = [];
        const myMap = new Map(Object.entries(list));
        for(let i = 0; i < myMap.size; i++){
            articleList.push(myMap.get(`${i}`))
            }
            
        document.querySelector("#preloader").remove();
        document.querySelector(".main-container").style.opacity = "1";
        
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

    

function addCard(articleTitle ,articleContent, articleID, articleStatus){
    let card = document.createElement("div");
    card.className = "dashboard-card";
    card.style.margin = "10px 10px";

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

    return card;
}

module.exports = { fetchData, addCard };