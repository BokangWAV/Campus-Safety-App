// notification.test.js
import '../scripts/notification'; // Import your notification module

describe('Notification Tests', () => {
  let notificationList;
  let unreadCountElement;

  beforeEach(() => {
    // Set up DOM elements required for the tests
    document.body.innerHTML = `
      <ul id="notification-list"></ul>
      <div id="unread-count">0</div>
    `;

    // Initialize the DOMContentLoaded event
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
  });

  it('should display notifications and update unread count', () => {
    // Ensure notifications are added
    notificationList = document.getElementById('notification-list');
    unreadCountElement = document.getElementById('unread-count');

    // Check if notifications are rendered correctly
    expect(notificationList.children.length).toBeGreaterThan(0);
    expect(unreadCountElement.textContent).toBe('1'); // Based on the initial notifications array
  });

  it('should mark notification as read on click', () => {
    const listItem = notificationList.firstChild;
    expect(listItem.classList.contains('unread')).toBe(true);
    // Simulate a click event
    listItem.click();
    expect(listItem.classList.contains('unread')).toBe(false);
    expect(unreadCountElement.textContent).toBe('0');
  });
});
