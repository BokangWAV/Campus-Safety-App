document.addEventListener('DOMContentLoaded', function() {
    console.log('form-submit.js loaded');
    document.getElementById('editProfileForm').addEventListener('submit', async function(event) {
      event.preventDefault(); // Prevent the form from submitting the default way
  
      console.log('Form submit event fired'); // Debugging line
  
      const updatedUser = {
        firstName: document.getElementById('race').value,
        lastName: document.getElementById('race').value,
        race: document.getElementById('race').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        age: document.getElementById('age').value
      };
  
      try {
        const uid = "tGbbA7VNkhZtmb8IbvLt0fckxIu2";
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/users/profile/${uid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedUser)
        });
  
        if (response.ok) {
          console.log('Updated user data:', updatedUser);
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
  
