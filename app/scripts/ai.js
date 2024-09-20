import { firebaseConfig} from "../modules/AI-init.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getVertexAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-vertexai-preview.js";


// Initialize FirebaseApp
const firebaseApp = initializeApp(firebaseConfig);

// Initialize the Vertex AI service
const vertexAI = getVertexAI(firebaseApp);

    // Initialize the generative model with a model that supports your use case
    // Gemini 1.5 models are versatile and can be used with all API capabilities
    const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

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

    setTimeout(async function() {

            // To generate text output, call generateContent with the text input
            const result = await model.generateContent(question);

            const response = result.response;
            let text = response.text();
        // HERE: Ask question to the chatbot using API
        text = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  
            .replace(/\*(.*?)\*/g, '<em>$1</em>')              
            .replace(/^\*\s(.*?)$/gm, '<li>$1</li>');          


        text = text.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');


        // Add response to the chat
        conversationList.innerHTML = conversationList.innerHTML + `
                    <div class="respose">
                        <p>
                        ${text}
                        </p>
                    </div>

        `;
    }, 2000);

    
    

    prompt.value = "";
});
