// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => store[key] = value,
        clear: () => store = {},
        removeItem: (key) => delete store[key],
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch and window.alert
global.fetch = jest.fn();
global.alert = jest.fn();

// Import necessary functions
const sendAnnouncement = require('../scripts/announcement');

describe('sendAnnouncement', () => {
    let sendBtn, titleInput, announcementInput, errorDiv;

    beforeEach(() => {
        // Set up the DOM elements
        document.body.innerHTML = `
            <input id="Title" value="" />
            <textarea id="announcement"></textarea>
            <div id="error" style="display:none;"></div>
            <button id="SendBtn">Send</button>
            <img id="profileDisplay" />
        `;

        sendBtn = document.getElementById('SendBtn');
        titleInput = document.getElementById('Title');
        announcementInput = document.getElementById('announcement');
        errorDiv = document.getElementById('error');

        // Set up localStorage mock data
        localStorage.setItem('userFirstName', 'John');
        localStorage.setItem('userLastName', 'Doe');
        localStorage.setItem('userProfile', 'profilePic.png');
        localStorage.setItem('uid', '12345');

        fetch.mockClear();  // Reset fetch mock
        alert.mockClear();  // Reset window.alert mock
    });

    afterEach(() => {
        localStorage.clear();
    });

    test('displays error when title or announcement is empty', async () => {
        // Set up empty inputs
        titleInput.value = "";
        announcementInput.value = "";

        await sendAnnouncement();

        expect(errorDiv.style.display).toBe('flex');
        expect(sendBtn.disabled).toBe(false);
        expect(sendBtn.innerText).toBe('Send');
    });

    test('hides error and sends announcement when title and announcement are provided', async () => {
        titleInput.value = "Emergency Alert";
        announcementInput.value = "This is an important message.";

        fetch.mockResolvedValueOnce({ ok: true });

        await sendAnnouncement();

        expect(errorDiv.style.display).toBe('none');
        expect(fetch).toHaveBeenCalledWith('https://sdp-campus-safety.azurewebsites.net/announcement/12345', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Emergency Alert",
                message: "This is an important message.",
                firstName: "John",
                lastName: "Doe",
                profilePicture: "profilePic.png"
            })
        });
        expect(sendBtn.disabled).toBe(false);
        expect(sendBtn.innerText).toBe('Send');
    });

    test('disables button and shows sending status during request', async () => {
        titleInput.value = "New Announcement";
        announcementInput.value = "This is a test.";

        fetch.mockResolvedValueOnce({ ok: true });

        const promise = sendAnnouncement(); // Call without waiting to check intermediate state

        expect(sendBtn.disabled).toBe(true);
        expect(sendBtn.innerText).toBe('Sending');
        expect(sendBtn.className).toBe('SendBtn Sending');

        await promise;

        expect(sendBtn.disabled).toBe(false);
        expect(sendBtn.innerText).toBe('Send');
    });

    test('shows alert and resets button when fetch fails', async () => {
        titleInput.value = "Test Announcement";
        announcementInput.value = "Test message.";

        fetch.mockResolvedValueOnce({ ok: false });

        await sendAnnouncement();

        expect(window.alert).toHaveBeenCalledWith('Failed to update');
        expect(sendBtn.disabled).toBe(false);
        expect(sendBtn.innerText).toBe('Send');
        expect(sendBtn.className).toBe('SendBtn');
    });

    test('clears input fields after successful send', async () => {
        titleInput.value = "Final Announcement";
        announcementInput.value = "Last test message.";

        fetch.mockResolvedValueOnce({ ok: true });

        await sendAnnouncement();

        expect(titleInput.value).toBe("");
        expect(announcementInput.value).toBe("");
    });

    test('handles fetch network error gracefully', async () => {
        titleInput.value = "Network Error Test";
        announcementInput.value = "This will fail due to network issues.";

        fetch.mockRejectedValueOnce(new Error('Network Error'));

        await sendAnnouncement();

        expect(window.alert).toHaveBeenCalledWith('Failed to update');
        expect(sendBtn.disabled).toBe(false);
        expect(sendBtn.innerText).toBe('Send');
    });

    test('sets the profile image if userProfile exists in localStorage', () => {
        const profileDisplay = document.getElementById('profileDisplay');
        expect(profileDisplay.src).toBe('profilePic.png');
    });

    test('does not set the profile image if userProfile is empty', () => {
        localStorage.setItem('userProfile', '');
        const profileDisplay = document.getElementById('profileDisplay');
        expect(profileDisplay.src).toBe('');
    });
});