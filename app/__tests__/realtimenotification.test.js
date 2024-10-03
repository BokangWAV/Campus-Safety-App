// Mock the Notification object
const mockNotification = jest.fn();
global.Notification = jest.fn().mockImplementation((title, options) => {
  mockNotification(title, options);
});

// Mock the fetch function
global.fetch = jest.fn();

import { showNotifications, sendNotification } from '../scripts/realtimenotification'; // Adjust the import path as necessary

describe('Notification Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showNotifications', () => {
    it('should show notification when permission is granted', () => {
      // Mock Notification.permission
      Object.defineProperty(Notification, 'permission', {
        value: 'granted',
        writable: true,
      });

      showNotifications('Test Heading', 'Test Body', '1');

      expect(mockNotification).toHaveBeenCalledWith('Test Heading', {
        body: 'Test Body',
        icon: './assets/Undraw/send.png',
        vibrate: [200, 100, 200],
        tag: '1',
      });
    });

    it('should request permission when permission is not granted', async () => {
      Object.defineProperty(Notification, 'permission', {
        value: 'default',
        writable: true,
      });

      const requestPermissionMock = jest.fn(() => Promise.resolve('granted'));
      Notification.requestPermission = requestPermissionMock;

      await showNotifications('Test Heading', 'Test Body', '2');

      expect(requestPermissionMock).toHaveBeenCalled();
      expect(mockNotification).toHaveBeenCalledWith('Test Heading', {
        body: 'Test Body',
        icon: './assets/Undraw/send.png',
        vibrate: [200, 100, 200],
        tag: '2',
      });
    });

    it('should not show notification when permission is denied', async () => {
      Object.defineProperty(Notification, 'permission', {
        value: 'denied',
        writable: true,
      });

      await showNotifications('Test Heading', 'Test Body', '3');

      expect(mockNotification).not.toHaveBeenCalled();
    });
  });

  describe('sendNotification', () => {
    it('should fetch unseen notifications and show them', async () => {
      // Set the uid in localStorage
      window.localStorage.setItem('uid', 'test_uid');

      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          json: () => Promise.resolve(data2), // Use your mock data
        })
      );

      await sendNotification();

      expect(fetch).toHaveBeenCalledWith('https://sdp-campus-safety.azurewebsites.net/notifications/Unseen/test_uid', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(mockNotification).toHaveBeenCalledTimes(data2.length);
      data2.forEach((elem) => {
        const heading = `New ${elem.type}`;
        const body = elem.type === "announcement"
          ? (elem.message.split(',')[1].length > 30
            ? `${elem.message.split(',')[1].slice(0, 25)}...`
            : elem.message.split(',')[1])
          : elem.message;

        expect(mockNotification).toHaveBeenCalledWith(heading, {
          body,
          icon: './assets/Undraw/send.png',
          vibrate: [200, 100, 200],
          tag: elem.notificationID,
        });
      });
    });

    it('should log error on fetch failure', async () => {
      // Mock fetch to return a rejected promise
      fetch.mockImplementationOnce(() => Promise.reject(new Error('API is down')));

      const consoleSpy = jest.spyOn(console, 'log');

      await sendNotification();

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should handle empty notifications gracefully', async () => {
      // Set the uid in localStorage
      window.localStorage.setItem('uid', 'test_uid');

      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          json: () => Promise.resolve([]), // Return empty notifications
        })
      );

      await sendNotification();

      expect(mockNotification).not.toHaveBeenCalled(); // No notifications should be shown
    });

    it('should handle notifications with different types', async () => {
      // Mock different notification types
      const mockNotificationData = [
        { ...data2[0], type: 'announcement', message: 'New Announcement, This is important news!' },
        { ...data2[0], type: 'report', message: 'New report received regarding an incident.' }
      ];

      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          json: () => Promise.resolve(mockNotificationData),
        })
      );

      await sendNotification();

      expect(mockNotification).toHaveBeenCalledTimes(mockNotificationData.length);
      mockNotificationData.forEach((elem) => {
        const heading = `New ${elem.type}`;
        const body = elem.type === "announcement"
          ? (elem.message.split(',')[1].length > 30
            ? `${elem.message.split(',')[1].slice(0, 25)}...`
            : elem.message.split(',')[1])
          : elem.message;

        expect(mockNotification).toHaveBeenCalledWith(heading, {
          body,
          icon: './assets/Undraw/send.png',
          vibrate: [200, 100, 200],
          tag: elem.notificationID,
        });
      });
    });
  });
});
