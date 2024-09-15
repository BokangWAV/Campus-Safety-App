// __mocks__/firebase-storage.js
export const getStorage = jest.fn(() => ({
    // Mock any properties or methods if needed
  }));
  
  // Mock other Storage functions if needed
  export const ref = jest.fn();
  export const uploadBytes = jest.fn();
  export const getDownloadURL = jest.fn();
  export const listAll = jest.fn();  