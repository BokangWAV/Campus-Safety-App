window.onload = async function () {
    try {
        
        const uid = window.localStorage.getItem('uid');
        console.log(uid);
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/users/${uid}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const result = await response.json();

        console.log(response)
      //console.log('User data fetched:', result); // Debugging line
  
      const user = Array.isArray(result) ? result[0] : result; // Assuming user is at index 0, if it's in an array

      if(user.profilePicture != ""){
          document.getElementById('profileDisplay').src = user.profilePicture;
      }

      if(user.role == "manager"){
        document.getElementById('managerAlert').style.display = 'flex'
        document.getElementById('managerRequests').style.display = 'flex'
      }
  
      //console.log('Processed user data:', user);
      window.localStorage.setItem('userFirstName', user.firstName)
      window.localStorage.setItem('userLastName', user.lastName)
      window.localStorage.setItem('userAge', user.age)
      window.localStorage.setItem('userRace', user.race)
      window.localStorage.setItem('userGender', user.gender)
      window.localStorage.setItem('userPhoneNumber', user.phoneNumber)
      window.localStorage.setItem('userProfile', user.profilePicture)
  
      // Update form fields with user data
      document.getElementById('firstname').value = user.firstName || '';
      document.getElementById('lastname').value = user.lastName || '';
      document.getElementById('race').value = user.race || '';
      document.getElementById('phoneNumber').value = user.phoneNumber || '';
      document.getElementById('age').value = user.age || '';
  
    } catch (error) {
      console.error('Error fetching or parsing user data:', error);
    }
  };
  
