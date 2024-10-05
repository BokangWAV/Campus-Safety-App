const { processEvent } = require('../../Backend/modules/events.js');
const { appendNotifications } = require('../../Backend/modules/notification.js');
const { db, FieldValue } = require('../../Backend/modules/init.js');

// Mock Firestore and appendNotifications
jest.mock('../../Backend/modules/init.js', () => ({
    db: {
        collection: jest.fn().mockReturnThis(),
        add: jest.fn(),
        get: jest.fn(),
    },
    FieldValue: {
        serverTimestamp: jest.fn(),
    },
}));

jest.mock('../../Backend/modules/notification.js', () => ({
    appendNotifications: jest.fn(),
}));

describe('processEvent', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('should assign correct risk level and safety guideline for high severity and evening event', async () => {
        const event = {
            name: 'Concert',
            capacity: 100,
            availableTickets: 10, // Severity is 90%
            location: 'Main Hall',
            imageUrl: 'http://example.com/image.jpg',
            time: '2023-10-01T20:00:00Z', // Evening time
        };
        
        // Mock Firestore's add method
        const mockAdd = jest.fn();
        db.collection.mockReturnValueOnce({
            add: mockAdd,
        });

        // Mock Firestore users get method to return data
        db.collection.mockReturnValueOnce({
            get: jest.fn().mockResolvedValue({
                empty: false,
                forEach: (callback) => {
                    const mockUserDocs = [{ id: 'user1' }, { id: 'user2' }];
                    mockUserDocs.forEach(callback);
                },
            }),
        });

        const result = await processEvent(event);

        expect(mockAdd).toHaveBeenCalledWith(
            expect.objectContaining({
                eventName: event.name,
                riskLevel: 'Take Precaution',
                safetyGuideline: expect.any(String),
            })
        );
        expect(appendNotifications).toHaveBeenCalled();
        expect(result).toEqual({ success: true, message: 'Event processed and notifications sent' });
    });

    it('should assign correct risk level for low severity and non-evening event', async () => {
        const event = {
            name: 'Lecture',
            capacity: 200,
            availableTickets: 150, // Severity is 25%
            location: 'Auditorium',
            imageUrl: 'http://example.com/image.jpg',
            time: '2023-10-01T10:00:00Z', // Morning time
        };

        const mockAdd = jest.fn();
        db.collection.mockReturnValueOnce({
            add: mockAdd,
        });

        const result = await processEvent(event);

        expect(mockAdd).toHaveBeenCalledWith(
            expect.objectContaining({
                eventName: event.name,
                riskLevel: 'Safe',
                safetyGuideline: expect.any(String),
            })
        );
        expect(appendNotifications).toHaveBeenCalled();
        expect(result).toEqual({ success: true, message: 'Event processed and notifications sent' });
    });

    it('should handle Firestore errors gracefully', async () => {
        const event = {
            name: 'Festival',
            capacity: 500,
            availableTickets: 50, // Severity is 90%
            location: 'Stadium',
            imageUrl: 'http://example.com/image.jpg',
            time: '2023-10-01T20:00:00Z', // Evening time
        };

        db.collection.mockReturnValueOnce({
            add: jest.fn().mockRejectedValueOnce(new Error('Firestore error')),
        });

        const result = await processEvent(event);

        expect(result).toEqual({ success: false, message: 'Error adding event to Firestore' });
        expect(appendNotifications).not.toHaveBeenCalled();
    });

    it('should handle notification errors gracefully', async () => {
        const event = {
            name: 'Seminar',
            capacity: 300,
            availableTickets: 100, // Severity is 66%
            location: 'Conference Room',
            imageUrl: 'http://example.com/image.jpg',
            time: '2023-10-01T18:00:00Z', // Evening time
        };

        db.collection.mockReturnValueOnce({
            add: jest.fn(),
        });
        appendNotifications.mockImplementationOnce(() => {
            throw new Error('Notification error');
        });

        const result = await processEvent(event);

        expect(result).toEqual({ success: false, message: 'Error sending notifications' });
    });
});
