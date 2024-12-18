document.addEventListener('DOMContentLoaded', function() {
    console.log('form-submit.js loaded');
    document.getElementById('editProfileForm').addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent the form from submitting the default way
  
      console.log('Form submit event fired'); // Debugging line
  
      const updatedUser = {
        firstName: document.getElementById('firstname').value,
        lastName: document.getElementById('lastname').value,
        race: document.getElementById('race').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        age: document.getElementById('age').value
      };

      //console.log('Processed user data:', user);
      window.localStorage.setItem('userFirstName', document.getElementById('firstname').value)
      window.localStorage.setItem('userLastName', document.getElementById('lastname').value)
      window.localStorage.setItem('userAge', document.getElementById('age').value)
      window.localStorage.setItem('userRace', document.getElementById('race').value)
      window.localStorage.setItem('userPhoneNumber', document.getElementById('phoneNumber').value)

      if(window.localStorage.getItem('userProfile') != ""){
        document.getElementById('profileDisplay').src = window.localStorage.getItem('userProfile');
    }
    if(window.localStorage.getItem('userRole') == "manager"){
      document.getElementById('managerAlert').style.display = 'flex'
      document.getElementById('managerRequests').style.display = 'flex'
    }
  
      try {
        const uid = window.localStorage.getItem('uid');
        const token = window.localStorage.getItem('accessToken');
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/users/profile/${uid}`, {
            method: 'PUT',
            headers: {
                userid:uid,
                authtoken: token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUser)
          })
  
        if (response.ok) {
          console.log('Updated user data:', updatedUser);
          // Show success alert when data is saved successfully
          alert('Profile changes saved successfully!');
          window.location.href = "./profile.html";
          //window.location.href = '/profile.html'; // Redirect after successful submission
        } else {
          alert('Failed to update');
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  });
  
