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

            console.log('Processing article:', myMap.get(`${i}`));
            }
            
        document.querySelector("#preloader").style.opacity = "0";
        document.querySelector(".main-container").style.opacity = "1";
        
        if(articleList.length > 0){
            articleList.forEach((article) => {
                if(article.status == "pending"){
                    document.querySelector(".pending-section").appendChild(addCard(article.title, article.content, article.status));
                }else{
                    document.querySelector(".approved-section").appendChild(addCard(article.title, article.content, article.status));
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
    
    document.querySelector("#btnDelete").addEventListener("click", ()=>{
        const thisDiv = this.parentElement;
        let thisID = this.dataset.userID;

        fetch(`https://sdp-campus-safety.azurewebsites.net/articles/${thisID}`, {
            method: 'DELETE'
        }).then(response => {
            if(response.ok){
                thisDiv.remove();
                console.log("This article is successfully deleted.");
                alert("This article is successfully deleted.");
            }else{
                console.error("Error", response.statusText);
                alert("An error has occurred");
            }
        }).catch(error =>{
            console.error("Error:", error);
        })
    })

    document.querySelector("#btnApprove").addEventListener("click", ()=>{
        const thisDiv = this.parentElement;
        let thisID = this.dataset.userID;
        let thisTitle = this.dataset.title;
        let thisName = this.dataset.name;

        fetch(`https://sdp-campus-safety.azurewebsites.net/articles/approve/${thisID}`, {
            method: 'PUT'
        }).then(response => {
            if(response.ok){
                thisDiv.remove();
                console.log("This article is successfully deleted.");
                alert("This article is successfully deleted.");
            }else{
                console.error("Error", response.statusText);
                alert("An error has occurred");
            }
        }).catch(error =>{
            console.error("Error:", error);
        })
    })
})

function addCard(articleTitle ,articleContent, articleUserID, articleStatus, articleName){
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

    deleteArticle.dataset.userID = articleUserID;
    deleteArticle.dataset.title = articleTitle;

    let buttonsDiv = document.createElement("div");
    buttonsDiv.style.display = "flex";
    buttonsDiv.style.flexDirection = "row";
    buttonsDiv.style.flexWrap = "wrap";
    buttonsDiv.appendChild(deleteArticle);

    if(articleStatus == "pending"){
        let approveBtn = document.createElement("button");
        approveBtn.id = "btnApprove";
        approveBtn.style.padding = "10px 20px";
        approveBtn.style.backgroundColor = "green";
        approveBtn.style.fontWeight = "bold";
        approveBtn.style.borderRadius = "5px"
        approveBtn.style.color = "white";
        approveBtn.style.border = "none"
        approveBtn.textContent = "Approve article";

        approveBtn.dataset.userID = articleUserID;
        approveBtn.dataset.title = articleTitle;
        approveBtn.dataset.name = articleName;
        buttonsDiv.appendChild(approveBtn);
    }

    card.appendChild(buttonsDiv);

    return card;
}
