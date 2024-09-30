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

jest.mock('firebase-admin', () => {
    const mFirestore = {
        collection: jest.fn(() => ({
            doc: jest.fn(() => ({
                set: jest.fn(),
                get: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            })),
        })),
    };
    return {
        initializeApp: jest.fn(),
        credential: {
            cert: jest.fn(),
        },
        firestore: jest.fn(() => mFirestore),
    };
});


// app/__tests__/index.test.js
const request = require('supertest');
const app = require('../../Backend/index'); // Adjust the path if necessary

describe('Campus Safety API', () => {
    
    it('should respond with a welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Welcome to the Campus Safety API');
    });

    // Test for getting all users
    it('should get all users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        // Add further assertions based on your actual response
    });

    // Test for getting a specific user
    it('should get a specific user by uid', async () => {
        const uid = '12345'; // Replace with an actual uid
        const response = await request(app).get(`/users/${uid}`);
        expect(response.status).toBe(200);
        // Add further assertions based on your actual response
    });

    // Test for adding a user
    it('should add a new user', async () => {
        const uid = '67890'; // Replace with an actual uid
        const newUser = { name: 'John Doe', email: 'john@example.com' }; // Replace with actual user data
        const response = await request(app).post(`/users/${uid}`).send(newUser);
        expect(response.status).toBe(200);
        expect(response.text).toBe('User added successfully');
    });

    // Test for updating a user's profile
    it('should update user profile', async () => {
        const uid = '67890'; // Replace with an actual uid
        const updatedProfile = { name: 'John Smith' }; // Replace with actual profile data
        const response = await request(app).put(`/users/profile/${uid}`).send(updatedProfile);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Updated profile successfully');
    });

    // Test for updating a user's profile picture
    it('should update user profile picture', async () => {
        const uid = '67890'; // Replace with an actual uid
        const profileURL = { url: 'http://example.com/profile.jpg' }; // Replace with actual profile picture URL
        const response = await request(app).put(`/user/profilePicture/${uid}`).send(profileURL);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Updated Profile Picture successfully');
    });

    // Test for adding an article
    it('should add a new article', async () => {
        const newArticle = { title: 'New Article', content: 'Article content' }; // Replace with actual article data
        const response = await request(app).post('/articles').send(newArticle);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Article added successfully');
    });

    // Test for deleting an article
    it('should delete an article', async () => {
        const uid = '67890'; // Replace with actual uid
        const title = 'New Article'; // Replace with actual title
        const response = await request(app).delete(`/articles/${uid}/${title}`);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Deleted article successfully');
    });

    // Test for adding a report
    it('should add a new report', async () => {
        const uid = '67890'; // Replace with actual uid
        const newReport = { description: 'Report description' }; // Replace with actual report data
        const response = await request(app).post(`/reports/${uid}`).send(newReport);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Report added successfully');
    });

    // Test for getting all reports
    it('should get all reports', async () => {
        const response = await request(app).get('/reports');
        expect(response.status).toBe(200);
        // Add further assertions based on your actual response
    });

    // Test for adding an alert
    it('should add a new alert', async () => {
        const newAlert = { message: 'Alert message' }; // Replace with actual alert data
        const response = await request(app).post('/alert').send(newAlert);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Alert added successfully');
    });

    // Test for updating an alert
    it('should update an alert', async () => {
        const uid = '67890'; // Replace with actual alert id
        const processor = { status: 'resolved' }; // Replace with actual alert update data
        const response = await request(app).put(`/alert/${uid}`).send(processor);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Updated alert successfully');
    });

    // Test for deleting an alert
    it('should delete an alert', async () => {
        const uid = '67890'; // Replace with actual alert id
        const response = await request(app).delete(`/alert/${uid}`);
        expect(response.status).toBe(200);
        expect(response.text).toBe('Deleted alert successfully');
    });
});