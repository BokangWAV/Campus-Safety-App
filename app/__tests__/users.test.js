const { getAllUsers, getUser, addUser, updateProfile, updateProfilePicture } = require('../../Backend/modules/users');
const { db } = require('../../Backend/modules/init');

// Mock Firestore methods
jest.mock('../../Backend/modules/init', () => ({
    db: {
        collection: jest.fn(() => ({
            get: jest.fn(),
            doc: jest.fn(() => ({
                get: jest.fn(),
                set: jest.fn(),
                update: jest.fn(),
            })),
        })),
    },
}));

describe('Users Module', () => {
    const uid = 'testUserId';
    const userData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '123-456-7890',
        age: 30,
        race: 'Asian',
        profilePicture: 'profilePicUrl',
    };

    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls after each test
    });

    test('getAllUsers should return all users', async () => {
        // Mocking the Firestore get method to return users
        const mockUsers = [
            { firstName: 'John', lastName: 'Doe' },
            { firstName: 'Jane', lastName: 'Smith' },
        ];

        db.collection().get.mockResolvedValueOnce({
            empty: false,
            forEach: jest.fn(callback => {
                mockUsers.forEach(user => callback({ data: () => user }));
            }),
        });

        const users = await getAllUsers();

        expect(users).toEqual(mockUsers); // Ensure users are returned correctly
    });

    test('getUser should return a user by uid', async () => {
        // Mocking the Firestore get method for a specific user
        db.collection().doc().get.mockResolvedValueOnce({
            exists: true,
            data: () => userData,
        });

        const user = await getUser(uid);

        expect(user).toEqual([userData]); // Ensure the correct user is returned
    });

    test('getUser should return an empty array if user does not exist', async () => {
        // Mocking the Firestore get method for a non-existing user
        db.collection().doc().get.mockResolvedValueOnce({
            exists: false,
        });

        const user = await getUser(uid);

        expect(user).toEqual([]); // Ensure an empty array is returned
    });

    test('addUser should add a user successfully', async () => {
        // Mocking the Firestore get method to check if user exists
        db.collection().doc().get.mockResolvedValueOnce({
            exists: false,
        });

        // Mocking the Firestore set method to simulate successful addition
        db.collection().doc().set.mockResolvedValueOnce();

        const result = await addUser(uid, userData);

        expect(result).toBe(true); // Ensure user was added successfully
    });

    test('addUser should return false if user already exists', async () => {
        // Mocking the Firestore get method to check if user exists
        db.collection().doc().get.mockResolvedValueOnce({
            exists: true,
        });

        const result = await addUser(uid, userData);

        expect(result).toBe(false); // Ensure user was not added
    });

    test('updateProfile should update user profile successfully', async () => {
        // Mocking the Firestore update method to simulate successful update
        db.collection().doc().update.mockResolvedValueOnce();

        const result = await updateProfile(uid, {
            phoneNumber: '987-654-3210',
            age: 35,
            race: 'Caucasian',
        });

        expect(result).toBe(true); // Ensure profile was updated successfully
    });

    test('updateProfile should return false if update fails', async () => {
        // Mocking the Firestore update method to simulate an error
        db.collection().doc().update.mockRejectedValueOnce(new Error('Update failed'));

        const result = await updateProfile(uid, {
            phoneNumber: '987-654-3210',
            age: 35,
            race: 'Caucasian',
        });

        expect(result).toBe(false); // Ensure profile was not updated
    });

    test('updateProfilePicture should update user profile picture successfully', async () => {
        // Mocking the Firestore update method to simulate successful update
        db.collection().doc().update.mockResolvedValueOnce();

        const result = await updateProfilePicture(uid, 'newProfilePicUrl');

        expect(result).toBe(true); // Ensure profile picture was updated successfully
    });

    test('updateProfilePicture should return false if update fails', async () => {
        // Mocking the Firestore update method to simulate an error
        db.collection().doc().update.mockRejectedValueOnce(new Error('Update failed'));

        const result = await updateProfilePicture(uid, 'newProfilePicUrl');

        expect(result).toBe(false); // Ensure profile picture was not updated
    });
});