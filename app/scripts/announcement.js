

const firstName = window.localStorage.getItem('userFirstName');
const lastName = window.localStorage.getItem('userLastName');
const userProfile = window.localStorage.getItem('userProfile');
const sendBtn = document.getElementById('SendBtn');



async function fetchData(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}


async function sendAnnouncement(){
    const titleInput = document.getElementById('Title');
    const announcementInput = document.getElementById('announcement');

    if(titleInput.value == "" || announcementInput.value == "" ){
        document.getElementById('error').style.display = 'flex';
        return
    }else{
        document.getElementById('error').style.display = 'none';
    }

    sendBtn.disabled = true;
    sendBtn.innerText = "Sending";
    sendBtn.className = "SendBtn Sending"

    
    let sent = false
    
    const title = titleInput.value;
    const announcement = announcementInput.value;

    const fullAnnouncement = {
        title: title,
        message: announcement,
        firstName: firstName,
        lastName: lastName,
        profilePicture: userProfile
    }

    try {
        if(window.localStorage.getItem('uid') === null){
            alert("You need to sign in.");
            window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/register.html"
        }
        const uid = window.localStorage.getItem('uid')
        const user = await fetchData(`https://sdp-campus-safety.azurewebsites.net/users/${uid}`);
        if(user[0].role == "user"){
            alert("You are not authorised to be on this page");
            window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/dashboardtest.html"
        }
        
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/announcement/${uid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(fullAnnouncement)
        });
  
        if (response.ok) {
          //window.location.href = '/profile.html'; // Redirect after successful submission
          sent = true
        } else {
          alert('Failed to send announcement');
          sendBtn.disabled = false;
            sendBtn.innerText = "Send";
            sendBtn.className = "SendBtn"
            

        }
      } catch (error) {
        console.error('Error:', error);
        sendBtn.disabled = false;
        sendBtn.innerText = "Send";
        sendBtn.className = "SendBtn"
      }


    titleInput.value = ""
    announcementInput.value = ""
    if( sent){
        sendBtn.disabled = false;
        sendBtn.innerText = "Send";
        sendBtn.className = "SendBtn"
        alert("Announcement sent")
    }
    
}


sendBtn.addEventListener('click', async ()=>{
    await sendAnnouncement()
})




if(window.localStorage.getItem('userProfile') != ""){
    document.getElementById('profileDisplay').src = window.localStorage.getItem('userProfile');
}
