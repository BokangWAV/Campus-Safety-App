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

const admin = require("firebase-admin");
const { db, FieldValue } = require('../../Backend/modules/init'); // Adjust path as necessary

// Mock Firebase Admin SDK
jest.mock("firebase-admin", () => {
    return {
        initializeApp: jest.fn(),
        firestore: jest.fn(() => ({
            collection: jest.fn(),
            doc: jest.fn(),
            // Mock other Firestore methods as needed
        })),
        credential: {
            cert: jest.fn(),
        },
    };
});

describe('Firebase Admin Initialization', () => {
    const mockServiceAccount = {
        projectId: "your-project-id",
        clientEmail: "your-client-email",
        privateKey: "your-private-key",
    };


    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should initialize Firebase Admin with credentials', () => {
        expect(admin.initializeApp).toHaveBeenCalledTimes(1);
        expect(admin.credential.cert).toHaveBeenCalledWith(mockServiceAccount);
    });

    it('should export a Firestore instance', () => {
        expect(db).toBeDefined();
        expect(admin.firestore).toHaveBeenCalledTimes(1);
    });

    it('should export Firestore FieldValue', () => {
        expect(FieldValue).toBeDefined();
    });

    it('should handle missing BASE64_ENCODED_SERVICE_ACCOUNT gracefully', () => {
        delete process.env.BASE64_ENCODED_SERVICE_ACCOUNT;

        expect(() => {
            require('../../Backend/modules/init'); // Adjust path as necessary
        }).toThrow("Environment variable BASE64_ENCODED_SERVICE_ACCOUNT is not set."); // Ensure the error message matches
    });

    it('should handle invalid BASE64_ENCODED_SERVICE_ACCOUNT gracefully', () => {
        process.env.BASE64_ENCODED_SERVICE_ACCOUNT = "invalid_base64";

        expect(() => {
            require('../../Backend/modules/init'); // Adjust path as necessary
        }).toThrow(); // You might want to specify an error message if you handle it in the code
    });
});
