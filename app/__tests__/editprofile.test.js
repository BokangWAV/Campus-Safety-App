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
      </form>
    `;

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => '12345'), // Return a mock UID
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
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    );

    // Trigger the onload event
    window.onload();

    // Wait for any async tasks to complete
    await Promise.resolve();

    // Check if the form fields are populated correctly
    expect(document.getElementById('firstname').value).toBe(mockUserData.firstName);
    expect(document.getElementById('lastname').value).toBe(mockUserData.lastName);
    expect(document.getElementById('race').value).toBe(mockUserData.race);
    expect(document.getElementById('phoneNumber').value).toBe(mockUserData.phoneNumber);
    expect(document.getElementById('age').value).toBe(String(mockUserData.age));
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
    window.onload();

    // Wait for any async tasks to complete
    await Promise.resolve();

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
    window.onload();

    // Wait for any async tasks to complete
    await Promise.resolve();

    expect(console.error).toHaveBeenCalledWith('Error fetching or parsing user data:', expect.any(Error));
  });
});
