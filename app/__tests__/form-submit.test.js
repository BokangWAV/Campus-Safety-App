/**
 * @jest-environment jsdom
 */

import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('form-submit.js', () => {
  let localStorageMock;
  let event;

  beforeEach(() => {
    // Reset mocks before each test
    fetchMock.resetMocks();

    // Set up DOM elements for the test
    document.body.innerHTML = `
      <form id="editProfileForm">
        <input type="text" id="firstName" value="John" />
        <input type="text" id="lastName" value="Doe" />
        <input type="text" id="race" value="Caucasian" />
        <input type="text" id="phoneNumber" value="1234567890" />
        <input type="number" id="age" value="25" />
        <button type="submit">Submit</button>
      </form>
    `;

    // Mock localStorage
    localStorageMock = jest.spyOn(window.localStorage, 'getItem').mockReturnValue('test-uid');

    // Create a mock event
    event = new Event('submit');
    jest.spyOn(event, 'preventDefault'); // Spy on preventDefault method to ensure it's called
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Clean up mocks after each test
  });

  test('should prevent default form submission and make a PUT request', async () => {
    const form = document.getElementById('editProfileForm');
    require('./form-submit'); // Simulate loading the JS file

    // Mock the fetch call to simulate a successful response
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });

    // Trigger form submission
    form.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled(); // Ensure default form submission is prevented

    // Wait for async code to execute
    await new Promise(setImmediate);

    // Expect fetch to have been called with the correct URL and method
    expect(fetchMock).toHaveBeenCalledWith(
      'https://sdp-campus-safety.azurewebsites.net/users/profile/test-uid',
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Caucasian',
          lastName: 'Caucasian',
          race: 'Caucasian',
          phoneNumber: '1234567890',
          age: '25',
        }),
      })
    );
  });

  test('should redirect to profile.html on successful update', async () => {
    const form = document.getElementById('editProfileForm');
    const locationMock = jest.spyOn(window.location, 'href', 'set'); // Mock window.location.href

    require('./form-submit'); // Simulate loading the JS file

    // Mock the fetch call to simulate a successful response
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });

    // Trigger form submission
    form.dispatchEvent(event);

    await new Promise(setImmediate); // Wait for async code to execute

    // Expect window location to be updated to profile.html
    expect(locationMock).toHaveBeenCalledWith('./profile.html');
  });

  test('should display an error alert on failed update', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 }); // Simulate a failed response
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const form = document.getElementById('editProfileForm');
    require('./form-submit'); // Simulate loading the JS file

    // Trigger form submission
    form.dispatchEvent(event);

    await new Promise(setImmediate); // Wait for async code to execute

    expect(alertMock).toHaveBeenCalledWith('Failed to update');
  });

  test('should handle fetch error', async () => {
    fetchMock.mockReject(new Error('Network error')); // Simulate a network error

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

    const form = document.getElementById('editProfileForm');
    require('./form-submit'); // Simulate loading the JS file

    // Trigger form submission
    form.dispatchEvent(event);

    await new Promise(setImmediate); // Wait for async code to execute

    expect(consoleErrorMock).toHaveBeenCalledWith('Error:', expect.any(Error));
  });
});
