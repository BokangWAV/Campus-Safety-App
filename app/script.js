document.addEventListener("DOMContentLoaded", function () {
  const notificationList = document.getElementById("notification-list");

  // Fake notifications array
  const fakeNotifications = [
    {
      message: "Emergency Drill Notification",
      timestamp: "2024-09-10 09:00:00",
      status: "sent",
      scheduled_time: null, // Only for scheduled notifications
    },
    {
      message: "Campus Closed Due to Weather",
      timestamp: "2024-09-09 14:00:00",
      status: "sent",
      scheduled_time: null,
    },
    {
      message: "Scheduled Power Outage Notification",
      timestamp: null, // Sent time is null for scheduled notifications
      status: "scheduled",
      scheduled_time: "2024-09-11 08:00:00",
    },
  ];

  // Render fake notifications
  fakeNotifications.forEach((notification) => {
    const listItem = document.createElement("li");
    listItem.className = `notification-item ${notification.status}`;

    const messageDiv = document.createElement("div");
    messageDiv.className = "notification-message";
    messageDiv.textContent = notification.message;

    const timestampDiv = document.createElement("div");
    timestampDiv.className = "notification-timestamp";
    if (notification.status === "scheduled") {
      timestampDiv.textContent = `Scheduled for: ${notification.scheduled_time}`;
    } else {
      timestampDiv.textContent = `Sent: ${notification.timestamp}`;
    }

    listItem.appendChild(messageDiv);
    listItem.appendChild(timestampDiv);
    notificationList.appendChild(listItem);
  });
});
