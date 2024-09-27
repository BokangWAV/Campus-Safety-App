// app/__tests__/article1.test.js

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

// Mock the Firebase Admin SDK
jest.mock('firebase-admin', () => {
    const mockFirestore = {
        collection: jest.fn(() => ({
            get: jest.fn(),
            add: jest.fn(),
            where: jest.fn(() => ({
                get: jest.fn(),
                delete: jest.fn(),
                update: jest.fn(),
            })),
        })),
    };

    return {
        initializeApp: jest.fn(),
        credential: {
            cert: jest.fn(() => ({ /* mock credentials */ })),
        },
        firestore: jest.fn(() => mockFirestore),
    };
});

// Now import the modules that depend on the environment variable
const { getAllArticles, getPendingArticles, addArticle, deleteArticle, addLike, approveArticle } = require('../../Backend/modules/article');
const { db } = require('../../Backend/modules/init'); // Import db for mocking

describe('Article Module', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllArticles should return all articles', async () => {
        const mockArticles = [{ title: 'Article 1' }, { title: 'Article 2' }];
        db.collection().get.mockResolvedValueOnce({
            empty: false,
            forEach: jest.fn((callback) => mockArticles.forEach(callback)),
        });

        const result = await getAllArticles();
        expect(result).toEqual(mockArticles);
    });

    test('getPendingArticles should return pending articles', async () => {
        const mockPendingArticles = [{ title: 'Pending Article' }];
        db.collection().where().get.mockResolvedValueOnce({
            empty: false,
            forEach: jest.fn((callback) => mockPendingArticles.forEach(callback)),
        });

        const result = await getPendingArticles();
        expect(result).toEqual(mockPendingArticles);
    });

    test('addArticle should add an article and return true', async () => {
        const article = { content: 'Some content', surname: 'Doe', title: 'New Article', name: 'John' };
        db.collection().add.mockResolvedValueOnce({ id: '1' });

        const result = await addArticle('userId', article);
        expect(result).toBe(true);
    });

    test('deleteArticle should return true after deletion', async () => {
        db.collection().where().delete.mockResolvedValueOnce();

        const result = await deleteArticle('userId', 'Some Title');
        expect(result).toBe(true);
    });

    test('addLike should increase like count and return true', async () => {
        const mockArticle = { likes: 0 };
        db.collection().where().get.mockResolvedValueOnce({
            empty: false,
            forEach: jest.fn((callback) => callback({ data: () => mockArticle })),
        });

        const result = await addLike('Some Name', 'Some Title');
        expect(result).toBe(true);
    });

    test('approveArticle should approve an article and return true', async () => {
        db.collection().where().update.mockResolvedValueOnce();

        const result = await approveArticle('Some Name', 'Some Title');
        expect(result).toBe(true);
    });
});
