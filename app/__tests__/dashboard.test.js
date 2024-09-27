import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import '../scripts/dashboard.js'; // Adjust path as needed

// Mocking Firebase modules
jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js', () => ({
    initializeApp: jest.fn(),
}));

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    addDoc: jest.fn(),
}));

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js', () => ({
    getAuth: jest.fn(),
    onAuthStateChanged: jest.fn(),
}));

describe('Dashboard Tests', () => {
    let mockUser;
    let mockAddDoc;

    beforeEach(() => {
        // Set up the mock user object
        mockUser = {
            displayName: 'John Doe',
        };

        // Mock the Firestore addDoc function to resolve with a document reference
        mockAddDoc = jest.fn().mockResolvedValue({
            id: 'testDocId',
        });

        // Mock the Firestore collection function to return an object with addDoc
        collection.mockReturnValue({
            addDoc: mockAddDoc,
        });

        // Mock the onAuthStateChanged to call the callback with the mock user
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(mockUser);
        });

        // Mock Firebase initialization
        initializeApp.mockReturnValue({});
        getFirestore.mockReturnValue({});
        getAuth.mockReturnValue({});
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should initialize Firebase and set current user details on auth state change', () => {
        // Verify that the Firebase app is initialized
        expect(initializeApp).toHaveBeenCalled();
        
        // Check if user details are set correctly
        expect(currentUserName).toBe('John');
        expect(currentUserSurname).toBe('Doe');
    });

    it('should post an alert to Firestore', async () => {
        // Trigger the postAlert function
        await postAlert();

        // Check if addDoc was called with correct data
        expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
            details: "EMERGENCY",
            alert_no: 1,
            surname: 'Doe',
            name: 'John',
            alert_date: expect.any(String), // We can expect the alert date to be a string in ISO format
        });

        // Check if the alert message is displayed
        expect(window.alert).toHaveBeenCalledWith('John Doe needs help urgently!!!!');
    });

    it('should handle the case when no user is signed in', () => {
        // Mock the onAuthStateChanged to simulate no user signed in
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(null);
        });

        // Simulate DOMContentLoaded event
        document.dispatchEvent(new Event('DOMContentLoaded'));

        // Verify default values
        expect(currentUserName).toBe('Unknown');
        expect(currentUserSurname).toBe('Unknown');
    });
});
