// jest.setup.js
global.firebase = {
    initializeApp: jest.fn(() => ({
      firestore: jest.fn(() => ({
        collection: jest.fn(() => ({
          doc: jest.fn(() => ({
            get: jest.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
          })),
        })),
      })),
      storage: jest.fn(() => ({
        ref: jest.fn(() => ({
          put: jest.fn(() => Promise.resolve({
            ref: {
              getDownloadURL: jest.fn(() => Promise.resolve('http://fakeurl.com/profile.jpg')),
            },
          })),
        })),
      })),
    })),
  };
  