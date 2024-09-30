import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Import the actual implementation
import '../scripts/summary'; // Adjust the path to your actual script

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({})),
    getDocs: jest.fn(),
}));

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js', () => ({
    getAuth: jest.fn(() => ({})),
    onAuthStateChanged: jest.fn(),
}));

// Setup DOM environment
document.body.innerHTML = `
  <div class="dashboard-container"></div>
`;

describe('Summary Script Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should handle user authentication correctly', async () => {
        const mockUser = {
            displayName: 'John Doe',
        };

        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(mockUser);
        });

        await require('../scripts/summary'); // Re-import to trigger onAuthStateChanged

        // Check if onAuthStateChanged was called correctly
        expect(onAuthStateChanged).toHaveBeenCalledWith(expect.any(Object), expect.any(Function));
    });

    test('should fetch and display alerts correctly', async () => {
        const mockAlertData = [
            { alert_date: '2023-09-01T10:00:00Z', details: 'Alert detail 1', name: 'John', surname: 'Doe' },
            { alert_date: '2023-09-02T11:00:00Z', details: 'Alert detail 2', name: 'John', surname: 'Doe' },
        ];

        const mockUser = {
            displayName: 'John Doe',
        };

        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(mockUser);
        });

        getDocs.mockResolvedValue({
            empty: false,
            forEach: (callback) => {
                mockAlertData.forEach(alert => callback({ data: () => alert }));
            }
        });

        await require('../scripts/summary'); // Re-import to trigger fetching alerts

        // Validate the number of alerts displayed
        expect(document.querySelectorAll('.dashboard-card').length).toBe(0);
        
        // Validate the content of the alerts
        const alerts = document.querySelectorAll('.dashboard-card');
        expect(alerts[0].querySelector('h3').textContent).toBe('Date: 01/09/23 Time: 10:00');
        expect(alerts[1].querySelector('div').textContent).toBe('Alert detail 2');
    });

    test('should handle empty alerts collection correctly', async () => {
        const mockUser = {
            displayName: 'John Doe',
        };

        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(mockUser);
        });

        getDocs.mockResolvedValue({ empty: true, forEach: jest.fn() });

        await require('../scripts/summary'); // Re-import to trigger onAuthStateChanged

        // Check if no alerts are created
        expect(document.querySelectorAll('.dashboard-card').length).toBe(0);
        expect(document.querySelector(".dashboard-content").textContent).toBe(null);
    });

    test('should format date and time correctly', () => {
        const alertDate = '2023-09-01T10:00:00Z';
        const formattedDate = returnDate(alertDate);

        expect(formattedDate).toBe('Date: 01/09/23 Time: 10:00');
    });

    test('should create history alert correctly', () => {
        const alertDate = '2023-09-01T10:00:00Z';
        const details = 'Test alert detail';
        createHistoryAlert(alertDate, details);

        const alertCard = document.querySelector('.dashboard-card');
        expect(alertCard).toBeTruthy();
        expect(alertCard.querySelector('h3').textContent).toBe('Date: 01/09/23 Time: 10:00');
        expect(alertCard.querySelector('div').textContent).toBe(details);
    });
});
