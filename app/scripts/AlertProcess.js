const timer = document.getElementById('Time');
const unit = document.getElementById('unit');
const sendBtn = document.getElementById('sendNow-btn');
const cancelBtn = document.getElementById('cancel-btn');
const safeBtn = document.getElementById('safe-btn');
const containerDisplay = document.getElementById('DisplayTimeout');

let countdown = 10;
safeBtn.style.opacity = 0;
var lat = 0;
var lon = 0;
var firstName = window.localStorage.getItem("userFirstName")  || "Daniel";
var lastName = window.localStorage.getItem("userLastName")  || "Mokone";


let intervalID = setInterval(()=>{
    if(countdown == 0){
        clearInterval(intervalID);
        sendAlert();
        cancelBtn.disabled = true;
        sendBtn.disabled = true;
        sendBtn.className = "sendNow-btn Sending";
        cancelBtn.className = "cancel-btn Canceling";
        return;
    }
    countdown--;
    timer.innerText = countdown;
}, 1000)


sendBtn.addEventListener('click', async ()=>{
    sendBtn.innerText = "Sending";
    sendBtn.className = "sendNow-btn Sending";
    cancelBtn.className = "cancel-btn Canceling";
    clearInterval(intervalID);
    cancelBtn.disabled = true;
    sendBtn.disabled = true;
    await sendAlert();
});

cancelBtn.addEventListener('click', async()=>{
    cancelBtn.innerText = "Canceling";
    cancelBtn.className = "cancel-btn Canceling";
    sendBtn.className = "sendNow-btn Sending";
    clearInterval(intervalID);
    cancelBtn.disabled = true;
    sendBtn.disabled = true;
    window.location.href = "./dashboardtest.html";
});

safeBtn.addEventListener('click', async ()=>{
    safeBtn.className = "safe-btn safe";
    await isSafe();
})

async function sendAlert() {
    containerDisplay.className = "DisplayTimeout innerSent";
    unit.remove();
    timer.innerText = "Alert Sent!";
    safeBtn.style.opacity = 1;

    const uid = window.localStorage.getItem("uid")

    const alert = {
        firstName: window.localStorage.getItem("userFirstName"),
        lastName: window.localStorage.getItem("userLastName"),
        lat: lat,
        lon: lon,
        uid: uid,
        age: window.localStorage.getItem('userAge'),
        race: window.localStorage.getItem('userRace'),
        gender: window.localStorage.getItem('userGender'),
        phoneNumber: window.localStorage.getItem('userPhoneNumber')
    }

    console.log(alert);

    await fetch(`https://sdp-campus-safety.azurewebsites.net/alert/${uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      })
    .then(() => {
        console.log("Alert Sent!!")
        //console.log("added");
    }).catch((error)=>{
        console.error(error)
    });

}


async function isSafe() {
    console.log("User is now safe update the database");
    console.log(window.localStorage.getItem("uid"))

    const uid = window.localStorage.getItem("uid")

    const alert = { viewer: uid}

    await fetch(`https://sdp-campus-safety.azurewebsites.net/alert/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      })
    .then(() => {
      console.log("Done")
      window.location.href = './dashboardtest.html';
        //console.log("added");
    }).catch((error)=>{
        console.error(error)
    });
    safeBtn.disabled = true;
    //window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/dashboardtest.html";
}



function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        //document.getElementById('geoLocation').value = position.coords.latitude + ", " + position.coords.longitude;
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log(position.coords.latitude + ", " + position.coords.longitude)
      }, function (error) {
        console.error("Error getting location: ", error);
        //document.getElementById('geoLocation').value = "Unable to retrieve location.";
      });
    } else {
      document.getElementById('geoLocation').value = "Geolocation is not supported by this browser.";
    }
}



window.onload = getLocation()


if(window.localStorage.getItem('userProfile') != ""){
  document.getElementById('profileDisplay').src = window.localStorage.getItem('userProfile');
}
if(window.localStorage.getItem('userRole') == "manager"){
  document.getElementById('managerAlert').style.display = 'flex'
  document.getElementById('managerRequests').style.display = 'flex'
}
