// __mocks__/firebase-app.js
export const initializeApp = jest.fn(() => ({
    /* Mocked Firebase app object properties can be added here if needed */
  }));
  
  export const getFirestore = jest.fn(() => ({
    /* Mocked Firestore object properties can be added here if needed */
  }));
  
  // Export other functions if you use them  