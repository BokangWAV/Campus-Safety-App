const firstName = window.localStorage.getItem('userFirstName');
const lastName = window.localStorage.getItem('userLastName');
const userProfile = window.localStorage.getItem('userProfile');
const sendBtn = document.getElementById('SendBtn');


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
        const uid = window.localStorage.getItem('uid')
        const response = await fetch(`http://localhost:8080/announcement/${uid}`, {
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
          alert('Failed to update');
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
    }
    
}


sendBtn.addEventListener('click', async ()=>{
    await sendAnnouncement()
})




if(window.localStorage.getItem('userProfile') != ""){
    document.getElementById('profileDisplay').src = window.localStorage.getItem('userProfile');
}