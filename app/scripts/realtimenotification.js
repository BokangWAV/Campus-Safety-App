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

function sendNotification(){
    const topic = "Events Party"
    showNotifications("Announcement", `A new announcement has been made regarding ${topic}`)
}

window.onload = sendNotification