// Import your modules and functions
import { db, auth } from '../modules/init.js';

// Mock Firestore functions
jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js', () => ({
  initializeApp: jest.fn()
}));

jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js', () => ({
  getFirestore: jest.fn(() => ({})), // Mock implementation of getFirestore
  getDocs: jest.fn()
}));

jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js', () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn()
}));

jest.mock('https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js', () => ({
    getStorage: jest.fn(() => ({}))
}));

// Mock DOM elements and methods
beforeEach(() => {
  document.body.innerHTML = `
    <div id="main"></div>
    <ul id="usersList"></ul>
  `;
});

describe('DOM Content Loaded Event', () => {
  test('should display users correctly when users are found', async () => {
    // Arrange
    const mockUsers = [
      { data: () => ({ name: 'John', surname: 'Doe' }) },
      { data: () => ({ name: 'Jane', surname: 'Smith' }) }
    ];
    getDocs.mockResolvedValueOnce({ empty: false, forEach: (callback) => mockUsers.forEach(callback) });
    const main = document.getElementById('main');
    const usersList = document.getElementById('usersList');

    // Act
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Wait for the async operation
    await new Promise(setImmediate); 

    // Assert
    expect(main.innerHTML).toContain('My current users:');
    expect(usersList.innerHTML).toContain('<li>John Doe</li>');
    expect(usersList.innerHTML).toContain('<li>Jane Smith</li>');
  });

  test('should display "No users found" when no users are found', async () => {
    // Arrange
    getDocs.mockResolvedValueOnce({ empty: true, forEach: () => {} });
    const usersList = document.getElementById('usersList');

    // Act
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Wait for the async operation
    await new Promise(setImmediate); 

    // Assert
    expect(usersList.innerHTML).toBe('<li>No users found</li>');
  });

  test('should display "Error fetching users" when an error occurs', async () => {
    // Arrange
    getDocs.mockRejectedValueOnce(new Error('Firestore error'));
    const usersList = document.getElementById('usersList');

    // Act
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // Wait for the async operation
    await new Promise(setImmediate); 

    // Assert
    expect(usersList.innerHTML).toBe('<li>Error fetching users</li>');
  });
});