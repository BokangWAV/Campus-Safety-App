

let notification

function showNotifications(heading, body){
    Notification.requestPermission()
    .then(perm=>{
        if(perm === "granted"){
            notification = new Notification(`${heading}`, {
                body: `${body}`,
                icon: "./assets/Undraw/send.png",
                vibrate: [200, 100, 200], // Vibration pattern (mobile devices)
            })
        }
        
    })
}

async function sendNotification(){

    try {
        const uid = window.localStorage.getItem('uid');
        await fetch(`http://localhost:8080/notifications/Unseen/${uid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(alert),
          })
        .then((reponse) => {return reponse.json() })
        .then((data)=>{
           data.forEach((elem)=>{
                const heading = `New ${elem.type}`;
                var body;
                if( elem.type == "announcement"){
                    body = elem.message.split(',')[0]
                }else{
                    body = elem.message
                }

                showNotifications(heading, body);
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
