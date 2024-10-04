var notifications;
const notificationList = document.getElementById("notification-list");
const unreadCountElement = document.getElementById("unread-count");
/* coverage ignore start */
document.addEventListener("DOMContentLoaded",async function () {
    
  
    try {
      const uid = window.localStorage.getItem('uid');
      console.log(uid);
      const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/notifications/${uid}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      notifications = await response.json()
      console.log(notifications)
    }catch(error){
      console.error(error)
    }


    if(window.localStorage.getItem('userProfile') != ""){
        document.getElementById('profileDisplay').src = window.localStorage.getItem('userProfile');
    }
    if(window.localStorage.getItem('userRole') == "manager"){
      document.getElementById('managerAlert').style.display = 'flex'
      document.getElementById('managerRequests').style.display = 'flex'
    }


    displayNotifications();

    // Example notifications array
    /*
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
    ];*/
  
    
    
  });


async function displayNotifications(){
  let unreadCount = notifications.filter(notification => notification.status === "unread").length;
  notificationList.remove()
  
    console.log(unreadCount);
    // Update unread count display
    unreadCountElement.textContent = unreadCount;
  
    // Loop through notifications and add them to the notification list
    notifications.sort((a, b) => {
      if (b.timestamp._seconds !== a.timestamp._seconds) {
          return b.timestamp._seconds - a.timestamp._seconds;
      }

      return b.timestamp._nanoseconds - a.timestamp._nanoseconds;});
       
      
  console.log("displaying")
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
    console.log(notification)
    if(notification.profile_pic == ""){
      profilePic.src ="./assets/Undraw/defaultpic.jpg"; // Default image if missing
    }else{
      profilePic.src = notification.profile_pic
    }
    
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
    if(notification.type == "alert"){
      messageDiv.textContent = "Emergency Alert:" + "  " +notification.message
    }else if(notification.type == "announcement"){
      messageDiv.innerHTML = ` <div class="NotificationContent">
        <h3>${notification.message.split(',')[0]}</h3>
        <h3 id="${notification.notificationID}" style="display:none; width: 100%;">${notification.message.split(',')[1]}</h3>
      </div>`
    }else{
      messageDiv.textContent = notification.message
    }
    

    const timestampDiv = document.createElement("div");
    timestampDiv.className = "notification-timestamp";
    const date = new Date(notification.timestamp._seconds * 1000);
    const dateOptions = { year: 'numeric', month: 'long', day: '2-digit' };
    const formattedDate = date.toLocaleDateString(undefined, dateOptions);  // Date in a human-readable format
    const formattedTime = date.toLocaleTimeString();
    timestampDiv.textContent = formattedDate + " at " + formattedTime;

    // Incident image (hidden by default)
    const incidentImage = document.createElement("img");
    if((notification.type === "report") || notification.type === "safety alert"){
      
      incidentImage.className = "incident-pic";
      console.log(notification.incident_image)
      if ( notification.incident_image.length>0) {
        incidentImage.src = notification.incident_image[0];
        incidentImage.alt = "Incident Image";
      } else {
        incidentImage.style.display = "none"; // Hide if there's no image
      }
    }
    

    // Initially hide additional info
    profilePic.style.display = "none";
    posterName.style.display = "none";
    timestampDiv.style.display = "none";

    // Append elements to the list item
    listItem.appendChild(headerDiv);
    listItem.appendChild(messageDiv);
    listItem.appendChild(timestampDiv);
    if(notification.type === "report" && notification.incident_image.length>0)listItem.appendChild(incidentImage);
    if(notification.type === "safety alert" && notification.incident_image.length>0)listItem.appendChild(incidentImage);
    // Toggle the display of additional info and the incident image on click
    listItem.addEventListener("click", async function () {
      if (listItem.classList.contains("expanded")) {
        if(notification.type == "announcement")document.getElementById(`${notification.notificationID}`).style.display = 'none';
        listItem.classList.remove("expanded");
        profilePic.style.display = "none";
        posterName.style.display = "none";
        timestampDiv.style.display = "none";
        if(notification.type == "report") incidentImage.style.display = "none";
        if(notification.type == "safety alert") incidentImage.style.display = "none";
      } else {
        if(notification.type == "announcement")document.getElementById(`${notification.notificationID}`).style.display = 'flex';
        listItem.classList.add("expanded");
        profilePic.style.display = "block";
        posterName.style.display = "block";
        timestampDiv.style.display = "block";
        if (notification.incident_image) {
          if(notification.type == "report") incidentImage.style.display = "block";
          if(notification.type == "safety alert") incidentImage.style.display = "block"; // Show the image if available
        }
        // Mark notification as read and update unread count
        if (notification.status === "unread") {
          try {

            notification.status = "read";
            unreadCount--;
            unreadCountElement.textContent = unreadCount;
            listItem.classList.remove("unread");
            
            const bodyElement = { notificationID: notification.notificationID}
            const uid = window.localStorage.getItem('uid');
            await fetch(`https://sdp-campus-safety.azurewebsites.net/notifications/status/${uid}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(bodyElement),
            })
            .then(() => {
              //Show user profile
              //loadData()
              console.log("uploaded and updating user details....")

              
            }).catch((error)=>{
              console.error(error)
            });
          } catch (error) {
            
          }
          
        }
      }
    });

    // Append the list item to the notification list
    notificationList.appendChild(listItem);
  });

  document.getElementById('notifications-section').appendChild(notificationList)
}

let interval2;
interval2 = setInterval(async ()=>{
  try {
    const uid = window.localStorage.getItem('uid');
    console.log(uid);
    const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/notifications/${uid}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    var tempNotifications = await response.json()
    if(notifications.length < tempNotifications.length){
      console.log("Got notifications now updating .....")
      notifications = []
      tempNotifications.forEach((elem)=>{
        notifications.push(elem);
      })
      notifications.sort((a, b) => {
        if (b.timestamp._seconds !== a.timestamp._seconds) {
            return b.timestamp._seconds - a.timestamp._seconds;
        }
  
        return b.timestamp._nanoseconds - a.timestamp._nanoseconds;
      });

      displayNotifications();

    }
  }catch(error){
    console.error(error)
  }
}, 30000)
/* coverage ignore end */
