import '../scripts/profiledata'; // Adjust path as needed
import { fireEvent } from '@testing-library/dom';

// Mocking fetch
global.fetch = jest.fn();

// Mocking Firebase
jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js', () => ({
  getFirestore: jest.fn(),
}));

jest.mock('https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js', () => ({
  getStorage: jest.fn(),
  ref: jest.fn(() => ({
    put: jest.fn(() => Promise.resolve({
      ref: {
        getDownloadURL: jest.fn(() => Promise.resolve('http://fakeurl.com/profile.jpg')),
      },
    })),
  })),
}));

// Mock firebase configuration and methods
const firebase = {
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({})), // Mock firestore function
  storage: jest.fn(() => ({})), // Mock storage function
};

// Assign the mock to the global scope
global.firebase = firebase;

describe('Edit Profile', () => {
  let form;

  beforeEach(() => {
    // Set up the HTML structure for the tests
    document.body.innerHTML = `
      <div>
        <img id="profilePic" src="" alt="Profile Picture" />
        <div id="name"></div>
        <div id="race"></div>
        <div id="phone"></div>
        <div id="email"></div>
        <div id="studentId"></div>
        <input id="imageUpload" type="file" />
      </div>
    `;

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => '12345'), // Mock UID
      },
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up mocks after each test
    jest.clearAllMocks();
  });

  it('should fetch user data and populate UI elements', async () => {
    const mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      race: 'Asian',
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      age: 25,
      profilePicture: 'http://fakeurl.com/profile.jpg',
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    );

    // Trigger the loadData function
    await loadData();

    // Check if the UI elements are populated correctly
    expect(document.getElementById('profilePic').src).toBe(mockUserData.profilePicture);
    expect(document.getElementById('name').innerText).toBe(`${mockUserData.firstName} ${mockUserData.lastName}`);
    expect(document.getElementById('race').innerText).toBe(`Race: ${mockUserData.race}`);
    expect(document.getElementById('phone').innerText).toBe(`Phone: ${mockUserData.phoneNumber}`);
    expect(document.getElementById('email').innerText).toBe(`Email: ${mockUserData.email}`);
    expect(document.getElementById('studentId').innerText).toBe(`Age: ${mockUserData.age}`);
  });

  it('should handle fetch error gracefully', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    // Spy on console.error
    console.error = jest.fn();

    // Trigger the loadData function
    await loadData();

    expect(console.error).toHaveBeenCalledWith('Error fetching or parsing user data:', expect.any(Error));
  });

  it('should handle JSON parsing error gracefully', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.reject(new Error('Failed to parse JSON')),
      })
    );

    // Spy on console.error
    console.error = jest.fn();

    // Trigger the loadData function
    await loadData();

    expect(console.error).toHaveBeenCalledWith('Error fetching or parsing user data:', expect.any(Error));
  });

  it('should upload an image and update the user profile picture', async () => {
    const imageFiles = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });
    const input = document.getElementById('imageUpload');
    
    // Simulate file selection
    Object.defineProperty(input, 'files', {
      value: [imageFiles],
    });
    
    // Simulate image upload
    const loadDataSpy = jest.spyOn(window, 'loadData');
    const bodyElement = { url: 'http://fakeurl.com/profile.jpg' };

    await fireEvent.change(input); // Ensure the event is triggered correctly

    expect(fetch).toHaveBeenCalledWith(`https://sdp-campus-safety.azurewebsites.net/user/profilePicture/12345`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyElement),
    });

    // Ensure loadData was called after the image upload
    expect(loadDataSpy).toHaveBeenCalled();
  });
});