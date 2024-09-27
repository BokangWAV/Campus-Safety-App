import { NormalRegisterUser, NormalSignInUser, GooglesignInUser } from '../modules/users.js';

// Mock the imported functions
jest.mock('../modules/users.js', () => ({
  NormalRegisterUser: jest.fn(),
  NormalSignInUser: jest.fn(),
  GooglesignInUser: jest.fn(),
}));

describe('Form Functionality Tests', () => {
  beforeEach(() => {
    // Set up the DOM structure before each test
    document.body.innerHTML = `
        <div id="app">
            <h1 id="header">Test Header</h1>
            <div id="full-form"></div>
            <button id="submit-btn">Submit</button>
            <button id="google-login">Google Login</button>
        </div>
    `;

    // Re-initialize button and form references
    global.submit_btn = document.getElementById("submit-btn");
    global.full_form = document.getElementById("full-form");
    global.header = document.getElementById("header");
    global.googleBtn = document.getElementById("google-login");
    
    // Set initial states
    global.registration = false;
    global.signin = true;

    // Manually initialize the login form
    initializeForm(); // Replace this with the actual function or logic to initialize your form
  });

  function initializeForm() {
    // Load the form with login fields directly here
    full_form.innerHTML = `
      <input type="email" id="email-input" placeholder="Email">
      <input type="password" id="password_text" placeholder="Password">
      <p id="inform"></p>
    `;
    header.innerText = "Sign-In"; // Set header for sign-in
  }

  test('should show registration fields when registering', () => {
    // Simulate switching to registration
    const registerLink = document.createElement('a');
    registerLink.id = 'RegisterLink';
    registerLink.innerText = 'Register';
    document.body.appendChild(registerLink);
    registerLink.click(); // Simulate clicking the registration link

    expect(full_form.querySelector('input[id="firstName_text"]')).toBeTruthy();
    expect(full_form.querySelector('input[id="lastName_text"]')).toBeTruthy();
    expect(full_form.querySelector('input[id="email_text"]')).toBeTruthy();
    expect(full_form.querySelector('input[id="password_text"]')).toBeTruthy();
    expect(full_form.querySelector('input[id="confirmPassword_text"]')).toBeTruthy();
    expect(header.innerText).toBe("Registration");
  });

  test('should show login fields when switching to login', () => {
    // Simulate switching to registration first
    const registerLink = document.createElement('a');
    registerLink.id = 'RegisterLink';
    registerLink.innerText = 'Register';
    document.body.appendChild(registerLink);
    registerLink.click(); // Show registration fields

    // Simulate clicking the "Login" link
    const loginLink = document.createElement('a');
    loginLink.id = 'LoginLink';
    loginLink.innerText = 'Already have an account? Sign In';
    full_form.appendChild(loginLink);
    loginLink.click();

    expect(full_form.querySelector('input[id="email-input"]')).toBeTruthy();
    expect(full_form.querySelector('input[id="password_text"]')).toBeTruthy();
    expect(header.innerText).toBe("Sign-In");
  });

  test('should validate and register user', async () => {
    // Set the fields for registration
    full_form.innerHTML = `
      <input type="text" id="firstName_text" value="John">
      <input type="text" id="lastName_text" value="Doe">
      <input type="email" id="email_text" value="john@example.com">
      <input type="password" id="password_text" value="password123">
      <input type="password" id="confirmPassword_text" value="password123">
      <p id="inform"></p>
    `;

    NormalRegisterUser.mockResolvedValue(true); // Mock successful registration

    // Simulate clicking the submit button
    submit_btn.innerText = "Register"; // Make sure it's set to register
    await submit_btn.click();

    expect(NormalRegisterUser).toHaveBeenCalledWith("John", "Doe", "john@example.com", "password123", expect.anything());
    expect(window.location.href).toBe("https://agreeable-forest-0b968ac03.5.azurestaticapps.net/edit-profile.html");
  });

  test('should validate and sign in user', async () => {
    // Set the fields for sign-in
    full_form.innerHTML = `
      <input type="email" id="email-input" value="john@example.com">
      <input type="password" id="password_text" value="password123">
      <p id="inform"></p>
    `;

    NormalSignInUser.mockResolvedValue(true); // Mock successful sign-in

    // Simulate clicking the submit button
    submit_btn.innerText = "SIGN IN"; // Make sure it's set to sign in
    await submit_btn.click();

    expect(NormalSignInUser).toHaveBeenCalledWith("john@example.com", "password123", expect.anything());
    expect(window.location.href).toBe("https://agreeable-forest-0b968ac03.5.azurestaticapps.net/dashboardtest.html");
  });

  test('should handle Google sign-in', async () => {
    googleBtn.click(); // Simulate clicking the Google login button

    GooglesignInUser.mockResolvedValue(true); // Mock successful Google sign-in
    await googleBtn.click();

    expect(GooglesignInUser).toHaveBeenCalled();
    expect(window.location.href).toBe("https://agreeable-forest-0b968ac03.5.azurestaticapps.net/dashboardtest.html");
  });
});
