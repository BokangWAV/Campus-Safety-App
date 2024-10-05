jest.useFakeTimers(); // For testing setInterval
global.fetch = jest.fn(); // Mock the fetch API

describe('../scripts/AlertProcess.js', () => {
  let timer, unit, sendBtn, cancelBtn, safeBtn, containerDisplay;

  beforeEach(() => {
    // Set up the DOM elements
    document.body.innerHTML = `
      <div id="Time"></div>
      <div id="unit"></div>
      <button id="sendNow-btn"></button>
      <button id="cancel-btn"></button>
      <button id="safe-btn"></button>
      <div id="DisplayTimeout"></div>
    `;

    timer = document.getElementById('Time');
    unit = document.getElementById('unit');
    sendBtn = document.getElementById('sendNow-btn');
    cancelBtn = document.getElementById('cancel-btn');
    safeBtn = document.getElementById('safe-btn');
    containerDisplay = document.getElementById('DisplayTimeout');
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn().mockImplementation((key) => {
          const mockData = {
            userFirstName: 'Daniel',
            userLastName: 'Mokone',
            uid: '1234',
            userAge: '25',
            userRace: 'African',
            userGender: 'Male',
            userPhoneNumber: '1234567890'
          };
          return mockData[key] || null;
        }),
        setItem: jest.fn(),
      },
      writable: true
    });

    // Import the script (assuming the script is modularized)
    require('../scripts/AlertProcess.js');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.resetModules();
  });

  test('initial state of buttons', () => {
    expect(sendBtn.disabled).toBe(false); // Send button should be enabled
    expect(cancelBtn.disabled).toBe(false); // Cancel button should be enabled
    expect(safeBtn.className).toBe("safe-btn"); // Safe button should have initial class
    expect(timer.innerText).toBe("10"); // Countdown should be initialized
  });

  test('countdown should decrement and call sendAlert at 0', () => {
    jest.spyOn(window, 'clearInterval');  // Spy on clearInterval
    const sendAlert = jest.spyOn(global, 'sendAlert'); // Spy on sendAlert

    // Simulate the countdown
    jest.advanceTimersByTime(10000);  // Fast forward 10 seconds

    expect(timer.innerText).toBe("0"); // Expect the countdown to be 0
    expect(sendAlert).toHaveBeenCalled(); // Expect sendAlert to be called
    expect(window.clearInterval).toHaveBeenCalled(); // Ensure the interval was cleared
  });

  test('sendAlert function should be called when send button is clicked', async () => {
    const sendAlert = jest.spyOn(global, 'sendAlert'); // Spy on sendAlert
    
    sendBtn.click();
    
    expect(sendBtn.innerText).toBe("Sending");  // Button text should change
    expect(sendBtn.disabled).toBe(true);  // Button should be disabled
    expect(cancelBtn.disabled).toBe(true);  // Cancel button should also be disabled
    expect(sendAlert).toHaveBeenCalled();  // SendAlert should be called
  });

  test('cancel button should redirect to dashboard when clicked', async () => {
    const windowSpy = jest.spyOn(window, 'location', 'set');
    
    cancelBtn.click();

    expect(cancelBtn.innerText).toBe("Canceling");  // Button text should change
    expect(cancelBtn.disabled).toBe(true);  // Button should be disabled
    expect(windowSpy).toHaveBeenCalledWith('./dashboardtest.html');  // Expect redirect
  });

  test('safe button should trigger isSafe', async () => {
    const isSafe = jest.spyOn(global, 'isSafe'); // Spy on isSafe function
    
    safeBtn.click();

    expect(safeBtn.className).toBe("safe-btn safe");  // Button class should change
    expect(isSafe).toHaveBeenCalled();  // isSafe function should be called
  });

  test('sendAlert should make a POST request with correct alert data', async () => {
    await global.sendAlert(); // Call the actual function

    expect(fetch).toHaveBeenCalledWith(
      'https://sdp-campus-safety.azurewebsites.net/alert/1234',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          firstName: 'Daniel',
          lastName: 'Mokone',
          lat: 0,
          lon: 0,
          uid: '1234',
          age: '25',
          race: 'African',
          gender: 'Male',
          phoneNumber: '1234567890',
        }),
      })
    );
  });

  test('isSafe should make a PUT request', async () => {
    await global.isSafe(); // Call the actual function

    expect(fetch).toHaveBeenCalledWith(
      'https://sdp-campus-safety.azurewebsites.net/alert/1234',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ viewer: '1234' })
      })
    );
  });

  test('sendAlert should handle fetch errors', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error'))); // Simulate fetch error
    const sendAlert = jest.spyOn(global, 'sendAlert');

    await global.sendAlert(); // Call the actual function

    expect(sendAlert).toHaveBeenCalled();  // Ensure the sendAlert was called
    // Check for any error handling response
  });

  test('multiple clicks on sendNow-btn should not trigger multiple alerts', async () => {
    const sendAlert = jest.spyOn(global, 'sendAlert');
    
    sendBtn.click();
    sendBtn.click(); // Click again quickly

    expect(sendAlert).toHaveBeenCalledTimes(1);  // Ensure it only triggered once
  });

  test('DisplayTimeout should update based on countdown', () => {
    jest.advanceTimersByTime(1000);  // Fast forward 1 second
    expect(containerDisplay.innerText).toBe("Time remaining: 9 seconds"); // Assuming you have this update in your script
  });

  test('countdown should update every second until it reaches zero', () => {
    for (let i = 0; i < 10; i++) {
      jest.advanceTimersByTime(1000); // Fast forward 1 second
      expect(timer.innerText).toBe((9 - i).toString()); // Expect countdown to match
    }
  });

  test('ensure timer does not go negative', () => {
    jest.advanceTimersByTime(11000); // Fast forward more than the countdown
    expect(timer.innerText).toBe("0"); // Ensure it does not go below zero
  });

  test('isSafe should handle fetch errors gracefully', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error'))); // Simulate fetch error
    const isSafe = jest.spyOn(global, 'isSafe');

    await global.isSafe(); // Call the actual function

    expect(isSafe).toHaveBeenCalled(); // Ensure the isSafe was called
    // You can check for specific UI changes or alerts here as necessary
  });
});
