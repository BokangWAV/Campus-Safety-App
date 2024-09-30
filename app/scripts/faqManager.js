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
                par.textContent = question.question;
                par.style.alignSelf = "center";
                par.style.fontWeight = "600";
                par.style.color = "black"

                let buttonContainer = document.createElement("div");
                buttonContainer.style.display = "flex";
                buttonContainer.style.flexWrap = "wrap";

                let approve = document.createElement("button");
                approve.id = "approve";
                approve.textContent = "Approve";
                approve.dataset.faqid = question.FAQID;

                approve.style.border = "none";
                approve.style.border = "none";
                approve.style.backgroundColor = "#4CAF50";
                approve.style.color = "white";
                approve.style.margin = "10px";
                approve.style.padding = "20px";

                let deleteBtn = document.createElement("button");
                deleteBtn.id = "delete";
                deleteBtn.textContent = "Delete";
                deleteBtn.dataset.faqid = question.FAQID;

                deleteBtn.style.border = "none";
                deleteBtn.style.border = "none";
                deleteBtn.style.backgroundColor = "red";
                deleteBtn.style.padding = "20px";
                deleteBtn.style.margin = "10px";
                deleteBtn.style.color = "white";

                let headQ = document.createElement("h3");
                headQ.textContent = "Question";

                let textArea = document.createElement("textarea");
                textArea.id = "myAnswer"
                textArea.style.minWidth = "90%";
                textArea.style.minHeight = "3em";

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

        document.querySelector("#preloader").style.opacity = "0";
        document.querySelector(".main-container").style.opacity = "1";    
        
        document.querySelector("#delete").addEventListener("click", () =>{
            const thisDiv = this.parentElement;
            const thisID = this.dataset.faqid;

            fetch(`https://sdp-campus-safety.azurewebsites.net/FAQ/${thisID}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'}
            }).then(response => {
                if(response.ok){
                    thisDiv.remove();
                    alert("FAQ successfully deleted.");
                }else{
                    console.error("Error:", response.statusText);
                    alert("An error has occurred");
                }
                
            }).catch(error => console.error("Error:", error));
        })

        document.querySelector("#approve").addEventListener("click", () =>{
            const myDiv =  this.parentElement;
            const text = myDiv.querySelector("#myAnswer").value;
            const faq_id = this.dataset.faqid;  
            const data = {
                answer: text
            }
            fetch(`https://sdp-campus-safety.azurewebsites.net/FAQ/${faq_id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(response => {
                if(response.ok){
                    alert("FAQ updated");
                    myDiv.remove()
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
        })

    } catch (error) {
        console.error(error);
    }
    
})
