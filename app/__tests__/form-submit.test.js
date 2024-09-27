import '../scripts/form-submit'; // Import your form-submit module
import { fireEvent } from '@testing-library/dom';

describe('Edit Profile Form Submission', () => {
  let form, firstNameInput, lastNameInput, raceInput, phoneNumberInput, ageInput;

  beforeEach(() => {
    // Set up the HTML structure for the tests
    document.body.innerHTML = `
      <form id="editProfileForm">
        <input id="firstName" type="text" value="John" />
        <input id="lastName" type="text" value="Doe" />
        <input id="race" type="text" value="Asian" />
        <input id="phoneNumber" type="text" value="1234567890" />
        <input id="age" type="number" value="25" />
        <button type="submit">Submit</button>
      </form>
    `;

    // Get form elements
    form = document.getElementById('editProfileForm');
    firstNameInput = document.getElementById('firstName');
    lastNameInput = document.getElementById('lastName');
    raceInput = document.getElementById('race');
    phoneNumberInput = document.getElementById('phoneNumber');
    ageInput = document.getElementById('age');

    // Set up mock for localStorage
    window.localStorage.setItem('uid', '12345');

    // Mock the fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    // Mock window.location
    delete window.location; // Delete original location
    window.location = { href: '' }; // Create a new mock location
  });

  afterEach(() => {
    // Clean up mock after each test
    jest.clearAllMocks();
  });

  it('should submit the form and redirect to profile page on successful update', async () => {
    // Simulate form submission
    fireEvent.submit(form);

    expect(fetch).toHaveBeenCalledWith('https://sdp-campus-safety.azurewebsites.net/users/profile/12345', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        race: raceInput.value,
        phoneNumber: phoneNumberInput.value,
        age: ageInput.value,
      }),
    });

    // Wait for the fetch call to complete
    await Promise.resolve();

    // Check if redirect happens
    expect(window.location.href).toBe('./profile.html');
  });

  it('should alert when the response is not ok', async () => {
    // Change fetch to simulate an unsuccessful update
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    // Spy on alert
    global.alert = jest.fn();

    // Simulate form submission
    fireEvent.submit(form);

    // Wait for the fetch call to complete
    await Promise.resolve();

    expect(global.alert).toHaveBeenCalledWith('Failed to update');
    expect(console.error).toHaveBeenCalledWith('Failed to update profile');
  });

  it('should log an error on fetch failure', async () => {
    // Mock fetch to throw an error
    fetch.mockImplementationOnce(() => Promise.reject('API is down'));

    // Spy on console.error
    console.error = jest.fn();

    // Simulate form submission
    fireEvent.submit(form);

    // Wait for the fetch call to complete
    await Promise.resolve();

    expect(console.error).toHaveBeenCalledWith('Error:', 'API is down');
  });
});
