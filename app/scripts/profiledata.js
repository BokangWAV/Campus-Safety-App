window.onload = async function () {
    try {
         const uid = window.localStorage.getItem('uid');
        console.log(uid);
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/users/${uid}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            },
        });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const result = await response.json();
      console.log('User data fetched:', result); // Debugging line
  
      const user = Array.isArray(result) ? result[0] : result;  // Assuming user is at index 0, if it's in an array
      
      //console.log('Processed user data:', user);
  
      // Update the profile picture
      document.getElementById('profileImg').style.backgroundImage = `url(${user.profilePicture})`; //|| 'assets/img/default.jpg'
  
      // Update name, race, phone, email, and other information
      document.getElementById('name').innerText = `${user.firstname || 'First Name'} ${user.lastname || 'Last Name'}`;
      document.getElementById('race').innerText = `Race: ${user.race || 'Unknown'}`;
      document.getElementById('phone').innerText = `Phone: ${user.phoneNumber || 'Not Provided'}`;
      document.getElementById('email').innerText = `Email: ${user.email || 'Not Provided'}`;
      document.getElementById('studentId').innerText = `Age: ${user.age || 'Not Provided'}`;
    } catch (error) {
      console.error('Error fetching or parsing user data:', error);
    }
  };
  
  
