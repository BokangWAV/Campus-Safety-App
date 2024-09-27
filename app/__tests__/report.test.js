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

const { addReport, getAllReports, getUserReport } = require('../../Backend/modules/report');
const { db } = require('../../Backend/modules/init');
const { appendNotifications } = require('../../Backend/modules/notification');

// Mock Firestore methods
jest.mock('../../Backend/modules/init', () => ({
    db: {
        collection: jest.fn(() => ({
            add: jest.fn(),
            get: jest.fn(() => ({
                empty: false,
                forEach: jest.fn(),
            })),
            doc: jest.fn(() => ({
                get: jest.fn(),
            })),
            where: jest.fn(() => ({
                get: jest.fn(() => ({
                    empty: false,
                    forEach: jest.fn(),
                })),
            })),
        })),
    },
}));

jest.mock('../../Backend/modules/notification', () => ({
    appendNotifications: jest.fn(),
}));

describe('Report Module', () => {
    const uid = 'testUserId';
    const reportData = {
        geoLocation: { lat: 0, lng: 0 },
        description: 'Test report',
        location: 'Test location',
        urgencyLevel: 'high',
        status: 'new',
        timestamp: Date.now(),
        imageUrls: ['url1', 'url2'],
        videoUrls: ['videoUrl1'],
    };

    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls after each test
    });

    test('addReport should add a report and notify managers', async () => {
        // Mocking the Firestore add method
        db.collection().add.mockResolvedValueOnce(); // Simulate successful report addition

        // Mocking the Firestore user fetch
        db.collection().doc.mockReturnValueOnce({
            get: jest.fn().mockResolvedValueOnce({
                exists: true,
                data: () => ({
                    firstName: 'John',
                    lastName: 'Doe',
                    profilePicture: 'profilePicUrl',
                }),
            }),
        });

        // Mocking the Firestore users collection to return a manager
        db.collection().where().get.mockResolvedValueOnce({
            empty: false,
            forEach: jest.fn(callback => {
                callback({ id: 'managerUserId' });
            }),
        });

        const result = await addReport(uid, reportData);

        expect(result).toBe(true); // Ensure report was added successfully
        expect(appendNotifications).toHaveBeenCalledWith(
            ['managerUserId'], // Manager user IDs
            'added a new report', // Notification message
            { firstName: 'John', lastName: 'Doe', profilePicture: 'profilePicUrl' }, // User data
            'report', // Report type
            'Test location', // Report location
            reportData.imageUrls // Image URLs
        );
    });

    test('addReport should return false on failure to add report', async () => {
        // Mocking the Firestore add method to simulate an error
        db.collection().add.mockRejectedValueOnce(new Error('Failed to add report'));

        const result = await addReport(uid, reportData);

        expect(result).toBe(false); // Ensure report was not added
    });

    test('getAllReports should return all reports', async () => {
        // Mocking the Firestore get method to return a report
        db.collection().get.mockResolvedValueOnce({
            empty: false,
            forEach: jest.fn(callback => {
                callback({
                    data: () => reportData, // Return the mocked report data
                });
            }),
        });

        const reports = await getAllReports();

        expect(reports).toEqual([reportData]); // Ensure reports are returned correctly
    });

    test('getUserReport should return user reports', async () => {
        // Mocking the Firestore get method for user reports
        db.collection().where().get.mockResolvedValueOnce({
            empty: false,
            forEach: jest.fn(callback => {
                callback({
                    data: () => reportData, // Return the mocked report data
                });
            }),
        });

        const reports = await getUserReport(uid);

        expect(reports).toEqual([reportData]); // Ensure user reports are returned correctly
    });
});
