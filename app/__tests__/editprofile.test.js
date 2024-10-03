import '../scripts/editprofile'; // Import your editProfile module
import { fireEvent } from '@testing-library/dom';

// Mocking fetch
global.fetch = jest.fn();

describe('Edit Profile', () => {
  let form;

  beforeEach(() => {
    // Set up the HTML structure for the tests
    document.body.innerHTML = `
      <form id="editProfileForm">
        <input id="firstname" type="text" />
        <input id="lastname" type="text" />
        <input id="race" type="text" />
        <input id="phoneNumber" type="text" />
        <input id="age" type="number" />
        <img id="profileDisplay" src="" alt="Profile" />
        <div id="managerAlert" style="display: none;">Manager Alert</div>
        <div id="managerRequests" style="display: none;">Manager Requests</div>
      </form>
    `;

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => {
          if (key === 'uid') return '12345'; // Return a mock UID
          if (key === 'userProfile') return 'mockProfilePicture.png'; // Mock profile picture
          return null;
        }),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up mocks after each test
    jest.clearAllMocks();
  });

  it('should fetch user data and populate form fields', async () => {
    const mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      race: 'Asian',
      phoneNumber: '1234567890',
      age: 25,
      profilePicture: 'mockProfilePicture.png',
      role: 'user', // Change to 'manager' for the next test
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    );

    // Trigger the onload event
    await window.onload();

    // Check if the form fields are populated correctly
    expect(document.getElementById('firstname').value).toBe(mockUserData.firstName);
    expect(document.getElementById('lastname').value).toBe(mockUserData.lastName);
    expect(document.getElementById('race').value).toBe(mockUserData.race);
    expect(document.getElementById('phoneNumber').value).toBe(mockUserData.phoneNumber);
    expect(document.getElementById('age').value).toBe(String(mockUserData.age));
    expect(document.getElementById('profileDisplay').src).toContain(mockUserData.profilePicture);
  });

  it('should show manager alerts if user role is manager', async () => {
    const mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      race: 'Asian',
      phoneNumber: '1234567890',
      age: 25,
      profilePicture: 'mockProfilePicture.png',
      role: 'manager', // Set role to manager
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    );

    // Trigger the onload event
    await window.onload();

    // Check if manager elements are displayed
    expect(document.getElementById('managerAlert').style.display).toBe('flex');
    expect(document.getElementById('managerRequests').style.display).toBe('flex');
  });

  it('should not show manager alerts if user role is not manager', async () => {
    const mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      race: 'Asian',
      phoneNumber: '1234567890',
      age: 25,
      profilePicture: 'mockProfilePicture.png',
      role: 'user', // Set role to user
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    );

    // Trigger the onload event
    await window.onload();

    // Check if manager elements are hidden
    expect(document.getElementById('managerAlert').style.display).toBe('none');
    expect(document.getElementById('managerRequests').style.display).toBe('none');
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

    // Trigger the onload event
    await window.onload();

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

    // Trigger the onload event
    await window.onload();

    expect(console.error).toHaveBeenCalledWith('Error fetching or parsing user data:', expect.any(Error));
  });

  it('should correctly handle the case where userProfile is empty', async () => {
    const mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      race: 'Asian',
      phoneNumber: '1234567890',
      age: 25,
      profilePicture: '', // No profile picture
      role: 'user',
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    );

    // Trigger the onload event
    await window.onload();

    // Check if profile display does not change
    expect(document.getElementById('profileDisplay').src).toBe('');
  });
});
