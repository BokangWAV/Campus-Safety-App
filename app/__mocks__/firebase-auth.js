// __mocks__/firebase-auth.js
const auth = {}; // Mock auth object

export const signInWithPopup = jest.fn(() => Promise.resolve({
    user: {
      email: 'mockuser@example.com',
      // Include other user properties if needed
    }
  }));
  
  export const GoogleAuthProvider = jest.fn(() => ({
    // Mock properties and methods of GoogleAuthProvider if needed
  }));
  
  export const signInWithEmailAndPassword = jest.fn(() => Promise.resolve({
    user: {
      email: 'mockuser@example.com',
      // Include other user properties if needed
    }
  }));
  
  export const signOut = jest.fn(() => Promise.resolve());
  
  export const createUserWithEmailAndPassword = jest.fn(() => Promise.resolve({
    user: {
      email: 'mockuser@example.com',
      // Include other user properties if needed
    }
  }));
  
  // Export other functions if you use them
  // __mocks__/firebase-auth.js

export const getAuth = jest.fn(() => ({
    // Mock any properties or methods if needed
  }));

  const getAuth = jest.fn().mockReturnValue({}); // Mock the auth object
  const onAuthStateChanged = jest.fn(() => ({

  }));
  
  module.exports = { getAuth, onAuthStateChanged, auth };
  
  