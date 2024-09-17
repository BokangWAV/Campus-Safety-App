document.addEventListener("DOMContentLoaded", function () {
  const notificationList = document.getElementById("notification-list");
  const userId = "1"; // Replace with actual user ID from Firebase Authentication

  // Fetch notifications from Firestore
  db.collection("notifications")
    .where("user_id", "==", userId)
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      console.log(`Number of notifications: ${querySnapshot.size}`);
      
      if (querySnapshot.empty) {
        console.log("No notifications found for this user.");
        notificationList.innerHTML = '<li>No notifications found.</li>';
      } else {
        querySnapshot.forEach((doc) => {
          const notification = doc.data();
          console.log("Notification data:", notification);
          
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
      }
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error);
    });
});
