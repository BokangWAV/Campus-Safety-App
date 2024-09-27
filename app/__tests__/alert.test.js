const { db } = require('../../Backend/modules/init'); // Adjust path as necessary
const { getAllAlerts, addAlert, deleteReport, updateViewAlert } = require('../../Backend/modules/alert');
const { appendNotifications } = require('../../Backend/modules/notification');

jest.mock('../../Backend/modules/init', () => {
    return {
        db: {
            collection: jest.fn(),
        },
        FieldValue: {
            serverTimestamp: jest.fn(),
        },
    };
});

jest.mock('../../Backend/modules/notification', () => ({
    appendNotifications: jest.fn(),
}));

describe('Alert Functions', () => {
    let mockCollection;
    let mockDocument;

    beforeEach(() => {
        mockCollection = {
            get: jest.fn(),
            add: jest.fn(),
            doc: jest.fn(),
            where: jest.fn().mockReturnThis(),
            delete: jest.fn(),
            update: jest.fn(),
        };
        db.collection.mockImplementation(() => mockCollection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllAlerts', () => {
        it('should return all alerts', async () => {
            const mockSnapshot = {
                empty: false,
                forEach: jest.fn(callback => {
                    callback({ data: () => ({ details: 'Test Alert' }) });
                }),
            };
            mockCollection.get.mockResolvedValue(mockSnapshot);

            const alerts = await getAllAlerts();
            expect(alerts).toEqual([{ details: 'Test Alert' }]);
            expect(mockCollection.get).toHaveBeenCalledTimes(1);
        });

        it('should return an empty array if no alerts exist', async () => {
            const mockSnapshot = { empty: true };
            mockCollection.get.mockResolvedValue(mockSnapshot);

            const alerts = await getAllAlerts();
            expect(alerts).toEqual([]);
            expect(mockCollection.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('addAlert', () => {
        it('should add an alert and notify managers', async () => {
            const uid = 'testUid';
            const alert = { firstName: 'John', lastName: 'Doe', lat: 12.34, lon: 56.78 };

            mockCollection.add.mockResolvedValue({ id: 'mockId' });

            const mockUserDoc = {
                exists: true,
                data: () => ({ firstName: 'John', lastName: 'Doe', profilePicture: 'mockUrl' }),
            };
            db.collection('users').doc = jest.fn().mockReturnValue({
                get: jest.fn().mockResolvedValue(mockUserDoc),
            });

            const mockManagerSnapshot = {
                empty: false,
                forEach: jest.fn(callback => {
                    callback({ id: 'manager1' });
                }),
            };
            mockCollection.where.mockImplementation(() => ({
                get: jest.fn().mockResolvedValue(mockManagerSnapshot),
            }));

            const result = await addAlert(uid, alert);
            expect(result).toBe(true);
            expect(mockCollection.add).toHaveBeenCalledTimes(1);
            expect(appendNotifications).toHaveBeenCalledWith(
                ['manager1'],
                'requires immediate attention',
                { firstName: 'John', lastName: 'Doe', profilePicture: 'mockUrl' },
                "alert",
                `${alert.lat} ${alert.lon}`,
                'mockUrl'
            );
        });

        it('should return false if adding the alert fails', async () => {
            mockCollection.add.mockRejectedValue(new Error('Failed to add alert'));

            const result = await addAlert('testUid', { firstName: 'John', lastName: 'Doe' });
            expect(result).toBe(false);
        });
    });

    describe('deleteReport', () => {
        it('should delete a report successfully', async () => {
            mockCollection.where.mockReturnValue({
                delete: jest.fn().mockResolvedValueOnce(),
            });

            const result = await deleteReport('testReportId');
            expect(result).toBe(true);
            expect(mockCollection.delete).toHaveBeenCalledTimes(1);
        });

        it('should return false if deleting the report fails', async () => {
            mockCollection.where.mockReturnValue({
                delete: jest.fn().mockRejectedValue(new Error('Failed to delete report')),
            });

            const result = await deleteReport('testReportId');
            expect(result).toBe(false);
        });
    });

    describe('updateViewAlert', () => {
        it('should update the alert status and viewer successfully', async () => {
            mockCollection.where.mockReturnValue({
                update: jest.fn().mockResolvedValueOnce(),
            });

            const result = await updateViewAlert('testReportId', { viewer: 'testViewer' });
            expect(result).toBe(true);
        });

        it('should return false if updating the alert fails', async () => {
            mockCollection.where.mockReturnValue({
                update: jest.fn().mockRejectedValue(new Error('Failed to update alert')),
            });

            const result = await updateViewAlert('testReportId', { viewer: 'testViewer' });
            expect(result).toBe(false);
        });
    });
});
