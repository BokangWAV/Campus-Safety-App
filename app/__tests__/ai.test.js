import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getVertexAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-vertexai-preview.js";
import '../scripts/ai'; // Import the ai.js file to initialize everything

jest.mock("https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js");
jest.mock("https://www.gstatic.com/firebasejs/10.13.0/firebase-vertexai-preview.js");

describe('AI Chatbot Functionality', () => {
    let mockModel;
    let mockApp;

    beforeEach(() => {
        mockApp = { /* Mock Firebase App */ };
        initializeApp.mockReturnValue(mockApp);
        mockModel = {
            generateContent: jest.fn(() => Promise.resolve({
                response: {
                    text: jest.fn(() => "Mock response text")
                }
            }))
        };
        getVertexAI.mockReturnValue(mockModel);
        getGenerativeModel.mockReturnValue(mockModel);

        // Set up the DOM elements required for the tests, matching your ai.html structure
        document.body.innerHTML = `
            <header class="Header">
                <div>
                    <a href="dashboardtest.html">
                        Back
                    </a>
                </div>
                    
                <div>
                    <h2>Campus-Safety Chatbot</h2>
                </div>
            </header>
            <main class="Main-Part">
                <section id="no-conversation" class="no-conversation">
                    <div class="no-Conversation-div">
                        <img src="assets/Undraw/chatbot-Svg.svg" alt="An example SVG image">
                    </div>
                </section>

                <section id="Chatbot-Conversation" class="Chatbot-Conversation noDisplay">
                    <div id="inner-Conversation" class="inner-Conversation"></div>
                </section>

                <div class="ask-Section">
                    <input type="text" placeholder="Ask anything about Safety" id="Chatbot-Prompt" class="Chatbot-Prompt">
                    <img id="Prompt-Btn" class="imageSend" alt="svgImg" src="./assets/Undraw/send.png" style="height: 35px; width: 35px;"/>
                </div>
            </main>
        `;

        // Simulate DOMContentLoaded event to trigger the code in ai.js
        document.dispatchEvent(new Event('DOMContentLoaded'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize Firebase and Vertex AI correctly', () => {
        expect(initializeApp).toHaveBeenCalled();
        expect(getVertexAI).toHaveBeenCalledWith(mockApp);
        expect(getGenerativeModel).toHaveBeenCalledWith(mockModel, { model: "gemini-1.5-flash" });
    });

    it('should handle the prompt button click and generate response', async () => {
        const promptInput = document.getElementById('Chatbot-Prompt');
        const promptBtn = document.getElementById('Prompt-Btn');
        const noConversation = document.getElementById('no-conversation');
        const conversationMain = document.getElementById('Chatbot-Conversation');
        const conversationList = document.getElementById('inner-Conversation');

        // Simulate entering a question
        promptInput.value = 'What is campus safety?';
        
        // Simulate button click
        promptBtn.click();

        // Expect no-conversation section to be hidden
        expect(noConversation.className).toContain('noDisplay');
        
        // Expect Chatbot-Conversation section to be displayed
        expect(conversationMain.className).not.toContain('noDisplay');

        // Wait for the asynchronous call to finish
        await new Promise((r) => setTimeout(r, 2000));

        // Check if the mock response was added to the conversation
        expect(conversationList.innerHTML).toContain("Mocked AI Response for: What is campus safety?");
    });

    it('should not generate a response if the input is empty', () => {
        const promptInput = document.getElementById('Chatbot-Prompt');
        const promptBtn = document.getElementById('Prompt-Btn');
        const conversationList = document.getElementById('inner-Conversation');

        // Set empty value
        promptInput.value = '';

        // Simulate button click
        promptBtn.click();

        // Expect no content to be added to the conversation list
        expect(conversationList.innerHTML).toBe('');
    });
});
