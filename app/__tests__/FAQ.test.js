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

const { getAllFAQ, getUserFAQ, respondFAQ, displayFAQ, deleteFAQ, addFAQ } = require('../../Backend/modules/FAQ');
const { db } = require('../../Backend/modules/init'); // Assuming init.js exports a Firestore mock
const { getUser } = require('../../Backend/modules/users');

// Mock Firestore methods
jest.mock('../../Backend/modules/init', () => ({
    db: {
        collection: jest.fn(() => ({
            where: jest.fn().mockReturnThis(),
            get: jest.fn(),
            doc: jest.fn(() => ({
                update: jest.fn(),
                delete: jest.fn(),
                add: jest.fn(),
            })),
            update: jest.fn(),
            delete: jest.fn(),
        })),
    },
}));

// Mock users.js method
jest.mock('../../Backend/modules/users', () => ({
    getUser: jest.fn(),
}));

describe('FAQ Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllFAQ', () => {
        it('should return all FAQs', async () => {
            const faqData = [
                { question: 'What is campus safety?', answer: 'Explanation' },
                { question: 'How can I contact the authorities?', answer: 'Call 911' },
            ];

            db.collection().get.mockResolvedValueOnce({
                empty: false,
                forEach: (cb) => faqData.forEach(cb),
            });

            const result = await getAllFAQ();
            expect(result).toEqual(faqData);
        });

        it('should return an empty array when there are no FAQs', async () => {
            db.collection().get.mockResolvedValueOnce({
                empty: true,
                forEach: jest.fn(),
            });

            const result = await getAllFAQ();
            expect(result).toEqual([]);
        });
    });

    describe('getUserFAQ', () => {
        it('should return FAQs for a specific user', async () => {
            const uid = 'user123';
            const faqData = [{ question: 'What is campus safety?', answer: 'Explanation' }];

            db.collection().where().get.mockResolvedValueOnce({
                empty: false,
                forEach: (cb) => faqData.forEach(cb),
            });

            const result = await getUserFAQ(uid);
            expect(result).toEqual(faqData);
            expect(db.collection().where).toHaveBeenCalledWith('uid', '==', uid);
        });

        it('should return an empty array if the user has no FAQs', async () => {
            const uid = 'user123';

            db.collection().where().get.mockResolvedValueOnce({
                empty: true,
                forEach: jest.fn(),
            });

            const result = await getUserFAQ(uid);
            expect(result).toEqual([]);
        });
    });

    describe('respondFAQ', () => {
        it('should update an FAQ with the provided answer', async () => {
            const FAQID = 1;
            const answer = 'This is the answer';

            db.collection().where().update.mockResolvedValueOnce();

            const result = await respondFAQ(FAQID, answer);
            expect(result).toBe(true);
            expect(db.collection().where).toHaveBeenCalledWith('FAQID', '==', FAQID);
            expect(db.collection().where().update).toHaveBeenCalledWith({ answer });
        });

        it('should return false if updating the FAQ fails', async () => {
            const FAQID = 1;
            const answer = 'This is the answer';

            db.collection().where().update.mockRejectedValueOnce(new Error('Update failed'));

            const result = await respondFAQ(FAQID, answer);
            expect(result).toBe(false);
        });
    });

    describe('displayFAQ', () => {
        it('should update the FAQ status to "display"', async () => {
            const FAQID = 1;

            db.collection().where().update.mockResolvedValueOnce();

            const result = await displayFAQ(FAQID);
            expect(result).toBe(true);
            expect(db.collection().where).toHaveBeenCalledWith('FAQID', '==', FAQID);
            expect(db.collection().where().update).toHaveBeenCalledWith({ status: 'display' });
        });

        it('should return false if updating the status fails', async () => {
            const FAQID = 1;

            db.collection().where().update.mockRejectedValueOnce(new Error('Update failed'));

            const result = await displayFAQ(FAQID);
            expect(result).toBe(false);
        });
    });

    describe('deleteFAQ', () => {
        it('should delete an FAQ', async () => {
            const FAQID = 1;

            db.collection().where().delete.mockResolvedValueOnce();

            const result = await deleteFAQ(FAQID);
            expect(result).toBe(true);
            expect(db.collection().where).toHaveBeenCalledWith('FAQID', '==', FAQID);
            expect(db.collection().where().delete).toHaveBeenCalled();
        });

        it('should return false if deleting the FAQ fails', async () => {
            const FAQID = 1;

            db.collection().where().delete.mockRejectedValueOnce(new Error('Delete failed'));

            const result = await deleteFAQ(FAQID);
            expect(result).toBe(false);
        });
    });

    describe('addFAQ', () => {
        it('should add a new FAQ', async () => {
            const uid = 'user123';
            const FAQ = { question: 'What is campus safety?' };
            const userData = [{ firstName: 'John', lastName: 'Doe', profilePicture: 'url' }];
            const faqData = [{}, {}, {}]; // Mock 3 existing FAQs

            getUser.mockResolvedValueOnce(userData);
            db.collection().get.mockResolvedValueOnce({
                empty: false,
                forEach: (cb) => faqData.forEach(cb),
            });
            db.collection().doc().add.mockResolvedValueOnce();

            const result = await addFAQ(uid, FAQ);
            expect(result).toBe(true);
            expect(getUser).toHaveBeenCalledWith(uid);
            expect(db.collection().doc().add).toHaveBeenCalledWith({
                question: FAQ.question,
                answer: '',
                uid: uid,
                firstName: userData[0].firstName,
                lastName: userData[0].lastName,
                FAQID: 4, // 3 existing + 1 new
                profilePicture: userData[0].profilePicture,
                status: 'pending',
            });
        });

        it('should return false if adding a new FAQ fails', async () => {
            const uid = 'user123';
            const FAQ = { question: 'What is campus safety?' };

            getUser.mockRejectedValueOnce(new Error('User fetch failed'));

            const result = await addFAQ(uid, FAQ);
            expect(result).toBe(false);
        });
    });
});
