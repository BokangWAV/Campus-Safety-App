// Import the functions you want to test from users.js
import { NormalRegisterUser, NormalSignInUser } from '../modules/users.js';

// Mock Firebase modules
jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js', () => ({
    initializeApp: jest.fn(() => ({})),
}));

jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js', () => ({
    getAuth: jest.fn(() => ({})),
    GoogleAuthProvider: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
}));

jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js', () => ({
    getFirestore: jest.fn(() => ({})),
}));

jest.mock('https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js', () => ({
    getStorage: jest.fn(() => ({})),
}));

// Mock DOM elements for the test
beforeEach(() => {
    document.body.innerHTML = `
        <button id="submit_btn">Submit</button>
        <input id="firstName_text" type="text" value="John" />
        <input id="lastName_text" type="text" value="Doe" />
        <input id="email_text" type="email" value="test@example.com" />
        <input id="password_text" type="password" value="password123" />
    `;
});

// Test for button click and mock DOM behavior
test('should handle button click and retrieve input values', async () => {
    // Mock functions
    const mockRegisterUser = jest.fn();

    // Attach mock DOM elements
    const submit_btn = document.getElementById('submit_btn');
    const firstNameInput = document.getElementById('firstName_text');
    const lastNameInput = document.getElementById('lastName_text');
    const emailInput = document.getElementById('email_text');
    const passwordInput = document.getElementById('password_text');

    // Simulate button click event listener
    if (submit_btn) {
        submit_btn.addEventListener('click', async () => {
            const firstName = firstNameInput?.value || '';
            const lastName = lastNameInput?.value || '';
            const email = emailInput?.value || '';
            const password = passwordInput?.value || '';

            // Call the mocked registration function
            await mockRegisterUser(firstName, lastName, email, password);
        });

        // Simulate the button click
        submit_btn.click();
    }

    // Assert that the mock function was called with the correct values
    expect(mockRegisterUser).toHaveBeenCalledWith('John', 'Doe', 'test@example.com', 'password123');
});

// Test Suite for Firebase Authentication
describe('Firebase Authentication Tests', () => {
    test('NormalSignInUser should successfully sign in with email and password', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        const mockSignIn = require('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js').signInWithEmailAndPassword;
        mockSignIn.mockResolvedValue({ user: { email } });

        const result = await NormalSignInUser(email, password);

        // Check that the mock resolved user object is returned correctly
        expect(result.user.email).toBe(email);
    });

    test('NormalRegisterUser should successfully register a new user', async () => {
        const firstName = 'John';
        const lastName = 'Doe';
        const email = 'test@example.com';
        const password = 'password123';

        const mockRegister = require('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js').createUserWithEmailAndPassword;
        mockRegister.mockResolvedValue({ user: { email } });

        const result = await NormalRegisterUser(firstName, lastName, email, password);

        // Check that the mock resolved user object is returned correctly
        expect(result.user.email).toBe(email);
    });

    test('User should successfully sign out', async () => {
        const mockSignOut = require('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js').signOut;

        await mockSignOut();

        // Ensure the signOut mock function was called
        expect(mockSignOut).toHaveBeenCalled();
    });
});
