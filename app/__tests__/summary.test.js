import { getFirestore, collection, getDocs } from 'firebase-firestore';
import { getAuth, onAuthStateChanged } from 'firebase-auth';

// Import the actual implementation
import '../scripts/summary'; // Adjust the path to your actual script

jest.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
    getFirestore: jest.fn(() => ({})),
    collection: jest.fn(() => ({})),
}));

jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js', () => ({
    getAuth: jest.fn(() => ({})),
    GoogleAuthProvider: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
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

  test('should call onAuthStateChanged and handle user correctly', async () => {
    const mockUser = {
      displayName: 'John Doe',
    };

    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
    });

    const mockAlertData = [
      { alert_date: '2023-09-01T10:00:00Z', details: 'Alert detail 1' },
      { alert_date: '2023-09-02T11:00:00Z', details: 'Alert detail 2' }
    ];

    getDocs.mockResolvedValue({
      empty: false,
      forEach: (callback) => {
        mockAlertData.forEach(alert => callback({ data: () => alert }));
      }
    });

    await require('../scripts/summary'); // Re-import to trigger onAuthStateChanged

    expect(onAuthStateChanged).toHaveBeenCalledWith(expect.any(Object), expect.any(Function));
    
    // Check if createHistoryAlert was called correctly
    expect(document.querySelectorAll('.dashboard-card').length).toBe(mockAlertData.length);

    // Validate the content of the alerts
    const alerts = document.querySelectorAll('.dashboard-card');
    expect(alerts[0].querySelector('h3').textContent).toBe('Date: 01/09/23 Time: 10:00');
    expect(alerts[1].querySelector('p').innerHTML).toBe('<b>Degree of alert:</b> Emergency');
    expect(alerts[1].querySelector('div').textContent).toBe('Alert detail 2');
  });

  test('should handle empty alerts collection correctly', async () => {
    getDocs.mockResolvedValue({ empty: true, forEach: jest.fn() });

    await require('../scripts/summary'); // Re-import to trigger onAuthStateChanged

    // Check if no alerts are created
    expect(document.querySelectorAll('.dashboard-card').length).toBe(0);
  });

  test('should format date and time correctly', () => {
    const alertDate = '2023-09-01T10:00:00Z';
    const formattedDate = returnDate(alertDate);

    expect(formattedDate).toBe('Date: 01/09/23 Time: 10:00');
  });
});
