// profile.test.js

// Mock the environment variable before importing any modules that use it
process.env.BASE64_ENCODED_SERVICE_ACCOUNT = Buffer.from(JSON.stringify({
    "type": "service_account",
    "project_id": "mock-project-id",
    "private_key_id": "mock-private-key-id",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMOCK_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
    "client_email": "mock-client-email@mock-project-id.iam.gserviceaccount.com",
    "client_id": "mock-client-id",
    "auth_uri": "https://mock-auth-uri",
    "token_uri": "https://mock-token-uri",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://mock-cert-url"
})).toString('base64');

// Mock Firebase Firestore
jest.mock('firebase/firestore', () => ({
    collection: jest.fn().mockReturnThis(),
    getDocs: jest.fn(),
    query: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
}));

// Mock the Firebase Admin SDK
jest.mock('firebase-admin', () => {
    return {
        initializeApp: jest.fn(),
        credential: {
            cert: jest.fn(() => ({})) // Mock the cert function to return an empty object
        },
        firestore: jest.fn(() => ({
            collection: jest.fn().mockReturnThis(),
            get: jest.fn(),
            add: jest.fn(),
            where: jest.fn().mockReturnThis(),
            update: jest.fn(),
            getDocs: jest.fn(),
            query: jest.fn(),
        })),
    };
});


const { getUser } = require('../../Backend/modules/profile'); // Adjust the path as necessary

// Enable fetch mock
require('jest-fetch-mock').enableMocks();

describe('getUser', () => {
    const uid = "tGbbA7VNkhZtmb8IbvLt0fckxIu2";

    beforeEach(() => {
        fetch.resetMocks(); // Reset mocks before each test
    });

    test('should fetch user data successfully', async () => {
        const mockUserData = { id: uid, name: 'John Doe' }; // Mocked user data

        fetch.mockResponseOnce(JSON.stringify(mockUserData)); // Mock the fetch response

        const userData = await getUser();

        expect(fetch).toHaveBeenCalledWith(`https://sdp-campus-safety.azurewebsites.net/users/${uid}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        expect(userData).toEqual(mockUserData); // Check that the returned data matches the mock
    });

    test('should return null when the fetch fails', async () => {
        fetch.mockRejectOnce(new Error('Network Error')); // Simulate a network error

        const userData = await getUser();

        expect(userData).toBeNull(); // Ensure the function returns null on error
        expect(console.error).toHaveBeenCalledWith("Failed to fetch user data:", expect.any(Error)); // Check error logging
    });

    test('should throw an error for non-OK responses', async () => {
        fetch.mockResponseOnce('', { status: 404, statusText: 'Not Found' }); // Mock a 404 response

        const userData = await getUser();

        expect(userData).toBeNull(); // Ensure the function returns null
        expect(console.error).toHaveBeenCalledWith("Failed to fetch user data:", expect.any(Error)); // Check error logging
    });
});
