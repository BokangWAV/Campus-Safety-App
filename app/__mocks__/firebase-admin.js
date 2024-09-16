// Backend/modules/__mocks__/firebase-admin.js
const admin = {
    initializeApp: jest.fn().mockReturnThis(),
    auth: jest.fn().mockReturnThis(),
    firestore: jest.fn().mockReturnThis(),
    // Add other methods you use from firebase-admin here
};

module.exports = admin;