document.addEventListener("DOMContentLoaded", function () {
    const notificationList = document.getElementById("notification-list");
    const unreadCountElement = document.getElementById("unread-count");
  
    // Example notifications array
    const notifications = [
      {
        //user_id: "1",
        message: "Emergency Alert: There's a suspicious person seen with a knife!",
        posted_by_name: "JOE",
        location: "Wartenweiller Library, East Campus",
        status: "unread", // Mark as unread
        timestamp: "2 September 2024 at 11:50:30 UTC+2",
        profile_pic: "https://firebasestorage.googleapis.com/v0/b/tdkus-fcf53.appspot.com/o/incident_images%2FElm-St-Fire-7-23-17.jpg?alt=media&token=c8ea7cf3-0d0e-4", // Placeholder for profile
        profile_link: "profile1.html", // Link to profile
        incident_image: "https://firebasestorage.googleapis.com/v0/b/tdkus-fcf53.appspot.com/o/incident_images%2FElm-St-Fire-7-23-17.jpg?alt=media&token=c8ea7cf3-0d0e-4" // Placeholder for incident image
      },
      {
        //user_id: "2",
        message: "Campus Closed Due to Weather",
        posted_by_name: "JANE",
        location: "Solomon Mahlangu Entrance",
        status: "read", // Mark as read
        timestamp: "9 September 2024 at 14:00:00 UTC+2",
        profile_pic: "https://firebasestorage.googleapis.com/v0/b/tdkus-fcf53.appspot.com/o/incident_images%2FElm-St-Fire-7-23-17.jpg?alt=media&token=c8ea7cf3-0d0e-4", // Placeholder for profile
        profile_link: "https://firebasestorage.googleapis.com/v0/b/tdkus-fcf53.appspot.com/o/incident_images%2FElm-St-Fire-7-23-17.jpg?alt=media&token=c8ea7cf3-0d0e-4", // Link to profile
        incident_image: null // No incident image
      }
    ];
  
    let unreadCount = notifications.filter(notification => notification.status === "unread").length;
  
    // Update unread count display
    unreadCountElement.textContent = unreadCount;
  
    // Loop through notifications and add them to the notification list
    notifications.forEach((notification) => {
      const listItem = document.createElement("li");
      listItem.className = `notification-item ${notification.status}`;
  
      // Create header section (profile picture and details)
      const headerDiv = document.createElement("div");
      headerDiv.className = "notification-header";
  
      const profileLink = document.createElement("a");
      profileLink.href = notification.profile_link || "#"; // Link to profile
      profileLink.target = "_blank"; // Open link in a new tab
  
      const profilePic = document.createElement("img");
      profilePic.className = "profile-pic";
      profilePic.src = notification.profile_pic || "default-profile.png"; // Default image if missing
      profilePic.alt = `${notification.posted_by_name}'s profile picture`;
  
      profileLink.appendChild(profilePic);
  
      const detailsDiv = document.createElement("div");
      detailsDiv.className = "notification-details";
  
      const posterName = document.createElement("div");
      posterName.className = "poster-name";
      posterName.textContent = notification.posted_by_name;
  
      //const notificationLocation = document.createElement("div");
      //notificationLocation.className = "notification-location";
      //notificationLocation.textContent = `Location: ${notification.location}`;
  
      detailsDiv.appendChild(posterName);
      //sdetailsDiv.appendChild(notificationLocation);
      headerDiv.appendChild(profileLink);
      headerDiv.appendChild(detailsDiv);
  
      // Notification message and timestamp
      const messageDiv = document.createElement("div");
      messageDiv.className = "notification-message";
      messageDiv.textContent = notification.message;
  
      const timestampDiv = document.createElement("div");
      timestampDiv.className = "notification-timestamp";
      timestampDiv.textContent = notification.timestamp;
  
      // Incident image (hidden by default)
      const incidentImage = document.createElement("img");
      incidentImage.className = "incident-pic";
      if (notification.incident_image) {
        incidentImage.src = notification.incident_image;
        incidentImage.alt = "Incident Image";
      } else {
        incidentImage.style.display = "none"; // Hide if there's no image
      }
  
      // Initially hide additional info
      profilePic.style.display = "none";
      posterName.style.display = "none";
      timestampDiv.style.display = "none";
  
      // Append elements to the list item
      listItem.appendChild(headerDiv);
      listItem.appendChild(messageDiv);
      listItem.appendChild(timestampDiv);
      listItem.appendChild(incidentImage);
  
      // Toggle the display of additional info and the incident image on click
      listItem.addEventListener("click", function () {
        if (listItem.classList.contains("expanded")) {
          listItem.classList.remove("expanded");
          profilePic.style.display = "none";
          posterName.style.display = "none";
          timestampDiv.style.display = "none";
          incidentImage.style.display = "none";
        } else {
          listItem.classList.add("expanded");
          profilePic.style.display = "block";
          posterName.style.display = "block";
          timestampDiv.style.display = "block";
          if (notification.incident_image) {
            incidentImage.style.display = "block"; // Show the image if available
          }
          // Mark notification as read and update unread count
          if (notification.status === "unread") {
            notification.status = "read";
            unreadCount--;
            unreadCountElement.textContent = unreadCount;
            listItem.classList.remove("unread");
          }
        }
      });
  
      // Append the list item to the notification list
      notificationList.appendChild(listItem);
    });
  });
  