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

document.addEventListener("DOMContentLoaded", async function(){
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

        const list = await fetchData('https://sdp-campus-safety.azurewebsites.net/FAQs');
        console.log(list);

        const faqList = [];
        const myMap = new Map(Object.entries(list));
        
        for (let i = 0; i < myMap.size; i++) {
            faqList.push(myMap.get(`${i}`));
        }

        faqList.forEach((question) => {
            if(question.status == "pending"){
                let card = document.createElement("div");
                card.className = "dashboard-card";
                card.style.margin = "20px";

                let par = document.createElement("p");
                par.id = "myQuestion";
                par.textContent = question.question;
                par.style.alignSelf = "center";
                par.style.fontWeight = "600";
                par.style.color = "black"

                let buttonContainer = document.createElement("div");
                buttonContainer.id = 'FAQButtonDiv';
                // buttonContainer.style.display = "flex";
                // buttonContainer.style.flexWrap = "wrap";

                let approve = document.createElement("button");
                approve.id = "approve";
                approve.textContent = "Approve";
                approve.dataset.faqid = question.FAQID;

                // approve.style.border = "none";
                // approve.style.border = "none";
                // approve.style.backgroundColor = "#4CAF50";
                // approve.style.color = "white";
                // approve.style.margin = "10px";
                // approve.style.padding = "20px";

                let deleteBtn = document.createElement("button");
                deleteBtn.id = "delete";
                deleteBtn.textContent = "Delete";
                deleteBtn.dataset.faqid = question.FAQID;

                // deleteBtn.style.border = "none";
                // deleteBtn.style.border = "none";
                // deleteBtn.style.backgroundColor = "red";
                // deleteBtn.style.padding = "20px";
                // deleteBtn.style.margin = "10px";
                // deleteBtn.style.color = "white";

                let headQ = document.createElement("h3");
                headQ.textContent = "Question";

                let textArea = document.createElement("textarea");
                textArea.id = "myAnswer"
                textArea.style.minWidth = "90%";
                textArea.style.minHeight = "5em";

                card.appendChild(headQ);
                card.appendChild(par);
                card.appendChild(textArea);
                buttonContainer.appendChild(approve);
                buttonContainer.appendChild(deleteBtn);
                card.appendChild(buttonContainer);

                document.querySelector(".pendingFAQ").appendChild(card);
            }else{
                let card = document.createElement("div");
                card.className = "dashboard-card";
                card.style.margin = "20px";

                let headQ = document.createElement("h3");
                let headA = document.createElement("h3");

                headQ.textContent = "Question";
                headA.textContent = "Answer";

                let par = document.createElement("p");
                par.textContent = question.question;
                par.style.alignSelf = "center";
                par.style.fontWeight = "600";
                par.style.color = "black"

                let answerPar = document.createElement("p");
                answerPar.textContent = question.answer;
                answerPar.style.alignSelf = "center";
                answerPar.style.fontWeight = "600";
                answerPar.style.color = "black"

                let buttonContainer = document.createElement("div");
                buttonContainer.style.display = "flex";
                buttonContainer.style.flexWrap = "wrap";

                let deleteBtn = document.createElement("button");
                deleteBtn.id = "delete";
                deleteBtn.dataset.faqid = question.FAQID;
                deleteBtn.textContent = "Delete";

                deleteBtn.style.border = "none";
                deleteBtn.style.border = "none";
                deleteBtn.style.backgroundColor = "red";
                deleteBtn.style.padding = "20px";
                deleteBtn.style.margin = "10px";
                deleteBtn.style.color = "white";

                card.appendChild(headQ)
                card.appendChild(par);
                card.appendChild(headA);
                card.appendChild(answerPar);
                buttonContainer.appendChild(deleteBtn);
                card.appendChild(buttonContainer);

                document.querySelector(".approvedCards").appendChild(card);
            }
        })

        document.querySelector("#preloader").remove();
        document.querySelector(".main-container").style.opacity = "1";    
        
        const deleteBtns = document.querySelectorAll("#delete")
        
        deleteBtns.forEach(button => {
            button.addEventListener("click", (event) =>{
                const thisDiv = event.target.parentElement.parentElement;
                const thisID = event.target.dataset.faqid;

                fetch(`https://sdp-campus-safety.azurewebsites.net/FAQ/${thisID}`, {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'}
                }).then(response => {
                    if(response.ok){
                        console.log("FAQ ID:", event.target.dataset.faqid);
                        thisDiv.remove();
                        alert("FAQ successfully deleted.");
                    }else{
                        console.error("Error:", response.statusText);
                        alert("An error has occurred");
                    }
                    
                }).catch(error => console.error("Error:", error));
            })
        })

        const approveBtns = document.querySelectorAll("#approve")
        
        approveBtns.forEach(approve => {
            approve.addEventListener("click", (event) =>{
            const container =  event.target.parentElement;
            const myDiv = container.parentElement;
            const text = myDiv.querySelector("#myAnswer").value;
            const question = myDiv.querySelector("#myQuestion").textContent;
            const faq_id = event.target.dataset.faqid;  
            const data = {
                answer: text
            }

            fetch(`https://sdp-campus-safety.azurewebsites.net/FAQ/${faq_id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(response => {
                if(response.ok){
                    alert("FAQ updated!");

                let card = document.createElement("div");
                card.className = "dashboard-card";
                card.style.margin = "20px";

                let headQ = document.createElement("h3");
                let headA = document.createElement("h3");

                headQ.textContent = "Question";
                headA.textContent = "Answer";

                let par = document.createElement("p");
                par.id = "myQuestion";
                par.textContent = question;
                par.style.alignSelf = "center";
                par.style.fontWeight = "600";
                par.style.color = "black"

                let answerPar = document.createElement("p");
                answerPar.textContent = text;
                answerPar.style.alignSelf = "center";
                answerPar.style.fontWeight = "600";
                answerPar.style.color = "black"

                let buttonContainer = document.createElement("div");
                buttonContainer.style.display = "flex";
                buttonContainer.style.flexWrap = "wrap";

                let deleteBtn = document.createElement("button");
                deleteBtn.id = "delete";
                deleteBtn.dataset.faqid = question.FAQID;
                deleteBtn.textContent = "Delete";

                deleteBtn.style.border = "none";
                deleteBtn.style.border = "none";
                deleteBtn.style.backgroundColor = "red";
                deleteBtn.style.padding = "20px";
                deleteBtn.style.margin = "10px";
                deleteBtn.style.color = "white";

                card.appendChild(headQ)
                card.appendChild(par);
                card.appendChild(headA);
                card.appendChild(answerPar);
                buttonContainer.appendChild(deleteBtn);
                card.appendChild(buttonContainer);

                document.querySelector(".approvedCards").appendChild(card);

                    myDiv.remove();
                    return response.json();
                }else{
                    alert("Something went wrong!");
                    throw new Error('Network response is not working')
                }
            }).then(data =>{
                console.log("Success:", data);
            }).catch(error => {
                console.error("Error:", error);
            })


            fetch(`https://sdp-campus-safety.azurewebsites.net/FAQ/publish/${faq_id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        })
    })

    } catch (error) {
        console.error(error);
    }
    
})
