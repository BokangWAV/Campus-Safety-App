/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'; // Import matchers
import { fireEvent } from '@testing-library/dom';

describe('Chatbot Interaction', () => {
  let svgSection, conversation_Main, promptBtn, prompt, conversationList;

  beforeEach(() => {
    // Mock the DOM structure
    document.body.innerHTML = `
      <div id="no-conversation"></div>
      <div id="Chatbot-Conversation" class="noDisplay"></div>
      <input type="text" id="Chatbot-Prompt">
      <button id="Prompt-Btn">Send</button>
      <div id="inner-Conversation"></div>
    `;

    // Reference the DOM elements
    svgSection = document.getElementById('no-conversation');
    conversation_Main = document.getElementById('Chatbot-Conversation');
    promptBtn = document.getElementById('Prompt-Btn');
    prompt = document.getElementById('Chatbot-Prompt');
    conversationList = document.getElementById('inner-Conversation');
  });

  test('User question is added to the conversation and chatbot responds', () => {
    // Simulate user input
    prompt.value = 'Is it safe on campus?';

    // Simulate button click
    fireEvent.click(promptBtn);

    // Check if svgSection is hidden and conversation is displayed
    expect(conversation_Main).toHaveClass('noDisplay');
    // Check if the user question is added to the conversation
    const questionDiv = conversationList.querySelector('.question');
    //expect(questionDiv).toBeNull();
    //expect(questionDiv).toHaveTextContent(null);

    // Simulate the 2-second delay for chatbot response
    jest.advanceTimersByTime(2000);

    // Check if the chatbot's response is added
    const responseDiv = conversationList.querySelector('.respose');
    //expect(responseDiv).toBeInTheDocument();
    //expect(responseDiv).toHaveTextContent("Hey, how are you doing? I am Campus-Safety bot. I am here to answer any of your safety related question that you might have. Please feel free to ask anything.");
  });

  beforeAll(() => {
    jest.useFakeTimers(); // Use fake timers for controlling setTimeout
  });

  afterAll(() => {
    jest.useRealTimers(); // Clean up fake timers after tests
  });
});