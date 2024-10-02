

let sendNotificationVar

function showNotifications(heading, body, id){
  if (Notification.permission === "granted") {
    sendNotificationVar = new Notification(`${heading}`, {
        body: `${body}`,
        icon: "./assets/Undraw/send.png",
        vibrate: [200, 100, 200],
        tag: `${id}`
    });
  }else{
    Notification.requestPermission()
    .then(perm=>{
      console.log("sending Notification1")
      console.log(perm)
        if(perm === "granted"){
          console.log("sending Notification")
            sendNotificationVar = new Notification(`${heading}`, {
                body: `${body}`,
                icon: "./assets/Undraw/send.png",
                vibrate: [200, 100, 200], // Vibration pattern (mobile devices)
                tag: `${id}`
            })
        }
        
    })
  }
}

async function sendNotification(){

    try {
      //console.log("Getting")
        const uid = window.localStorage.getItem('uid');
        await fetch(`https://sdp-campus-safety.azurewebsites.net/notifications/Unseen/${uid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        .then((reponse) => {return reponse.json() })
        .then((data)=>{
          console.log("Found new notification")
           data.forEach((elem)=>{
                console.log(elem)
                const heading = `New ${elem.type}`;
                var body;
                if( elem.type == "announcement"){
                  var tempBody = elem.message.split(',')[1];
                  if(tempBody.length > 30){
                    body = tempBody.slice(0, 25) + "...";
                  }else{
                    body = tempBody;
                  }
                }else{
                    body = elem.message
                }
                console.log(heading)
                console.log(body)
                
                showNotifications(heading, body, elem.notificationID);
                console.log("Notification sent")
           })
        }).catch((error)=>{
            console.error(error)
        });
    } catch (error) {
        console.log(error)
    }
    //const topic = "Events Party"
    //showNotifications("Announcement", `A new announcement has been made regarding ${topic}`)
}



const data2 =[ {
    "viewer": "",
    "uid": "GTGCINvyJIXLXglT7kxO0u4rgFn2",
    "incident_image": "",
    "posted_by_name": "Sempapa Daniel",
    "profile_pic": "",
    "notificationID": 9,
    "location": "-26.0891435 28.1005632",
    "message": "Sempapa Daniel requires immediate attention",
    "type": "report",
    "unseen": "true",
    "profile_link": "",
    "status": "unread",
    "timestamp": {
      "_seconds": 1727729519,
      "_nanoseconds": 387000000
    }
  },
  {
    "viewer": "",
    "uid": "GTGCINvyJIXLXglT7kxO0u4rgFn2",
    "incident_image": "",
    "posted_by_name": "Sempapa Daniel",
    "profile_pic": "",
    "notificationID": 9,
    "location": "-26.0891435 28.1005632",
    "message": "Sempapa Daniel requires immediate attention",
    "type": "report",
    "unseen": "true",
    "profile_link": "",
    "status": "unread",
    "timestamp": {
      "_seconds": 1727729519,
      "_nanoseconds": 294000000
    }
  }
]

let interval;
setInterval(() => {
    sendNotification()
}, 30000);

window.onload = sendNotification
