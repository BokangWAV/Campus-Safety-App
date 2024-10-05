const { sendAnnouncement } = require('../../Backend/modules/announcement');
const { db } = require('../../Backend/modules/init');
const { appendNotifications } = require('../../Backend/modules/notification');

// Mock the appendNotifications function
jest.mock('../../Backend/modules/notification', () => ({
    appendNotifications: jest.fn(),
}));

// Mock Firestore functions
jest.mock('../../Backend/modules/init', () => ({
    db: {
        collection: jest.fn().mockReturnThis(),
        add: jest.fn(),
        get: jest.fn(),
        orderBy: jest.fn().mockReturnThis(),
    },
}));

describe('sendAnnouncement', () => {
    const uid = 'testUserId';
    const announcement = {
        title: 'Test Announcement',
        message: 'This is a test message.',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'url_to_picture',
    };

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test('successfully sends an announcement and sends notifications', async () => {
        // Mock response for ordering by announcementID
        db.collection.mockReturnValueOnce({
            orderBy: jest.fn().mockReturnThis(),
            get: jest.fn().mockResolvedValueOnce({
                docs: [{ data: () => ({ announcementID: 1 }) }],
            }),
            add: jest.fn().mockResolvedValueOnce(),
        });

        // Mock response for users collection
        db.collection.mockReturnValueOnce({
            get: jest.fn().mockResolvedValueOnce({
                empty: false,
                forEach: jest.fn((callback) => {
                    callback({ id: 'user1' });
                    callback({ id: 'user2' });
                }),
            }),
        });

        const result = await sendAnnouncement(uid, announcement);

        expect(result).toBe(true);
        expect(db.collection).toHaveBeenCalledWith('annuoncements');
        expect(db.collection).toHaveBeenCalledWith('users');
        expect(db.collection().add).toHaveBeenCalledWith({
            announcementID: 2,
            title: announcement.title,
            announcement: announcement.message,
            firstName: announcement.firstName,
            lastName: announcement.lastName,
            profilePicture: announcement.profilePicture,
            uid: uid,
        });
        expect(appendNotifications).toHaveBeenCalledWith(
            ['user1', 'user2'],
            `${announcement.title}, ${announcement.message}`,
            {
                firstName: announcement.firstName,
                lastName: announcement.lastName,
                profilePicture: announcement.profilePicture,
            },
            'announcement',
            '',
            null
        );
    });

    test('fails to send an announcement due to error in Firestore', async () => {
        // Mock response for ordering by announcementID
        db.collection.mockReturnValueOnce({
            orderBy: jest.fn().mockReturnThis(),
            get: jest.fn().mockResolvedValueOnce({
                docs: [{ data: () => ({ announcementID: 1 }) }],
            }),
            add: jest.fn().mockRejectedValueOnce(new Error('Firestore Error')),
        });

        const result = await sendAnnouncement(uid, announcement);

        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalledWith("Error writing document: ", expect.any(Error));
    });

    test('handles the case when there are no existing announcements', async () => {
        // Mock response for ordering by announcementID
        db.collection.mockReturnValueOnce({
            orderBy: jest.fn().mockReturnThis(),
            get: jest.fn().mockResolvedValueOnce({ docs: [] }),
            add: jest.fn().mockResolvedValueOnce(),
        });

        // Mock response for users collection
        db.collection.mockReturnValueOnce({
            get: jest.fn().mockResolvedValueOnce({
                empty: false,
                forEach: jest.fn((callback) => {
                    callback({ id: 'user1' });
                    callback({ id: 'user2' });
                }),
            }),
        });

        const result = await sendAnnouncement(uid, announcement);

        expect(result).toBe(true);
        expect(db.collection().add).toHaveBeenCalledWith({
            announcementID: 1, // First announcement
            title: announcement.title,
            announcement: announcement.message,
            firstName: announcement.firstName,
            lastName: announcement.lastName,
            profilePicture: announcement.profilePicture,
            uid: uid,
        });
    });

    test('handles the case when there are no users to notify', async () => {
        // Mock response for ordering by announcementID
        db.collection.mockReturnValueOnce({
            orderBy: jest.fn().mockReturnThis(),
            get: jest.fn().mockResolvedValueOnce({
                docs: [{ data: () => ({ announcementID: 1 }) }],
            }),
            add: jest.fn().mockResolvedValueOnce(),
        });

        // Mock response for users collection with no users
        db.collection.mockReturnValueOnce({
            get: jest.fn().mockResolvedValueOnce({
                empty: true,
            }),
        });

        const result = await sendAnnouncement(uid, announcement);

        expect(result).toBe(true);
        expect(appendNotifications).not.toHaveBeenCalled(); // No notifications should be sent
    });
});
