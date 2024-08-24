//Import stuff HERE:




//Declare variables here
const svgSection = document.getElementById("no-conversation");
const conversation_Main = document.getElementById("Chatbot-Conversation");
const promptBtn = document.getElementById("Prompt-Btn");
const prompt = document.getElementById("Chatbot-Prompt");
const conversationList = document.getElementById("inner-Conversation");



// User clicks on a button to ask a prompt
promptBtn.addEventListener('click', ()=>{
    const question = prompt.value;

    // If user has not typed anything dont do anything
    if(!question){
        return;
    }

    // remove the wierd looking lady
    svgSection.className = "noDisplay";

    // Add the conversation div
    conversation_Main.className = "Chatbot-Conversation";


    // Add the question to the page
    // We will do this manually
    const tempDiv = document.createElement('div');
    tempDiv.className = 'question';

    const tempP = document.createElement('p');
    tempP.innerText = question;


    tempDiv.appendChild(tempP);
    conversationList.appendChild(tempDiv);

    setTimeout(function() {
        // HERE: Ask question to the chatbot using API
        const response = "Hey, how are you doing? I am Campus-Safety bot. I am here to answer any of your safety related question that you might have. Please feel free to ask anything.";

        // Add response to the chat
        conversationList.innerHTML = conversationList.innerHTML + `
                    <div class="respose">
                        <p>
                        ${response}
                        </p>
                    </div>

        `;
    }, 2000);

    
    

    prompt.value = "";
});