// notification.test.js

const { displayNotifications } = require('../scripts/notification');

describe('Notification Module', () => {
    let notifications;

    beforeEach(() => {
        // Set up the DOM elements that are manipulated in the notification module
        document.body.innerHTML = `
            <ul id="notification-list"></ul>
            <span id="unread-count"></span>
        `;

        notifications = [
            {
                notificationID: "1",
                message: "Test notification 1",
                posted_by_name: "Alice",
                status: "unread",
                timestamp: { _seconds: Math.floor(Date.now() / 1000) },
                profile_pic: "profile1.jpg",
                profile_link: "profile1.html",
                type: "alert"
            },
            {
                notificationID: "2",
                message: "Test notification 2",
                posted_by_name: "Bob",
                status: "read",
                timestamp: { _seconds: Math.floor(Date.now() / 1000) },
                profile_pic: "profile2.jpg",
                profile_link: "profile2.html",
                type: "announcement"
            }
        ];
    });

    test('should display notifications correctly', () => {
        displayNotifications(notifications);
        
        const notificationList = document.getElementById("notification-list");
        const unreadCountElement = document.getElementById("unread-count");

        // Check that the correct number of notifications is displayed
        expect(notificationList.children.length).toBe(notifications.length);

        // Check the unread count
        const unreadCount = notifications.filter(notification => notification.status === "unread").length;
        expect(unreadCountElement.textContent).toBe(String(unreadCount));
    });

    test('should mark notifications as read when clicked', async () => {
        const listItem = displayNotifications(notifications)[0]; // Simulate clicking the first notification
        
        listItem.click(); // Simulate click event
        expect(listItem.classList.contains("unread")).toBe(false); // Check that the unread class was removed
        
        // Simulate a fetch request to update the notification status
        await updateNotificationStatus(notifications[0].notificationID); // Replace with your actual function
        expect(notifications[0].status).toBe("read"); // Check if the notification status was updated
    });

    test('should handle API errors gracefully', async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error('API is down'))
        );

        console.error = jest.fn(); // Mock console.error to track error messages
        await fetchNotifications(); // Replace with your actual function that fetches notifications

        expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Check if an error was logged
    });
});
