// notification1.test.js

// Mock Firebase admin and Firestore
jest.mock('../../Backend/modules/init', () => {
    const mockFirestore = {
        collection: jest.fn(() => mockFirestore),
        where: jest.fn(() => mockFirestore),
        get: jest.fn(),
        add: jest.fn(),
        update: jest.fn(),
    };

    return {
        db: mockFirestore,
        FieldValue: {
            serverTimestamp: jest.fn(() => 'mock-timestamp'),
        }
    };
});

const { appendNotifications, getAllNotifications, getAllReadNotifications, getAllUnreadNotifications, updateNotificationStatus } = require('../../Backend/modules/notification.js');
const { db, FieldValue } = require('../../Backend/modules/init.js');

describe('Notification Module', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    test('getAllNotifications should return all notifications for a user', async () => {
        const mockData = [{ message: 'Notification 1' }, { message: 'Notification 2' }];
        db.get.mockResolvedValueOnce({
            empty: false,
            forEach: (callback) => mockData.forEach(callback),
        });

        const result = await getAllNotifications('user123');
        expect(result).toEqual(mockData);
        expect(db.collection).toHaveBeenCalledWith('notifications');
        expect(db.where).toHaveBeenCalledWith('uid', '==', 'user123');
    });

    test('getAllReadNotifications should return read notifications for a user', async () => {
        const mockData = [{ message: 'Read Notification' }];
        db.get.mockResolvedValueOnce({
            empty: false,
            forEach: (callback) => mockData.forEach(callback),
        });

        const result = await getAllReadNotifications('user123');
        expect(result).toEqual(mockData);
        expect(db.collection).toHaveBeenCalledWith('notifications');
        expect(db.where).toHaveBeenCalledWith('uid', '==', 'user123');
        expect(db.where).toHaveBeenCalledWith('status', '==', 'read');
    });

    test('getAllUnreadNotifications should return unread notifications for a user', async () => {
        const mockData = [{ message: 'Unread Notification' }];
        db.get.mockResolvedValueOnce({
            empty: false,
            forEach: (callback) => mockData.forEach(callback),
        });

        const result = await getAllUnreadNotifications('user123');
        expect(result).toEqual(mockData);
        expect(db.collection).toHaveBeenCalledWith('notifications');
        expect(db.where).toHaveBeenCalledWith('uid', '==', 'user123');
        expect(db.where).toHaveBeenCalledWith('status', '==', 'unread');
    });

    test('appendNotifications should add notifications to the database', async () => {
        const mockUser = {
            firstName: 'John',
            lastName: 'Doe',
            profilePicture: 'http://profilepic.com/johndoe',
        };

        db.get.mockResolvedValueOnce({
            empty: false,
            size: 10, // Simulating 10 existing notifications
        });

        db.add.mockResolvedValueOnce({ id: 'mockNotificationId' });

        const notificationArray = ['user1', 'user2'];
        const result = await appendNotifications(
            notificationArray,
            'Test message',
            mockUser,
            'alert',
            'Campus',
            'http://image.com'
        );

        expect(db.collection).toHaveBeenCalledWith('notifications');
        expect(db.add).toHaveBeenCalledTimes(notificationArray.length);
        expect(db.add).toHaveBeenCalledWith({
            notificationID: 11,
            timestamp: 'mock-timestamp',
            posted_by_name: 'John Doe',
            profile_pic: 'http://profilepic.com/johndoe',
            profile_link: 'http://profilepic.com/johndoe',
            message: 'Test message',
            status: 'unread',
            viewer: '',
            uid: 'user1',
            location: 'Campus',
            incident_image: 'http://image.com',
            type: 'alert',
        });
    });

    test('updateNotificationStatus should update the notification status to "read"', async () => {
        db.update.mockResolvedValueOnce();

        const result = await updateNotificationStatus('user123', 1);
        expect(result).toBe(true);
        expect(db.collection).toHaveBeenCalledWith('notifications');
        expect(db.where).toHaveBeenCalledWith('uid', '==', 'user123');
        expect(db.where).toHaveBeenCalledWith('notificationID', '==', 1);
        expect(db.update).toHaveBeenCalledWith({
            status: 'read',
        });
    });

    test('updateNotificationStatus should return false if update fails', async () => {
        db.update.mockRejectedValueOnce(new Error('Update failed'));

        const result = await updateNotificationStatus('user123', 1);
        expect(result).toBe(false);
    });
});
