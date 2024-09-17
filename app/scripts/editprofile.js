window.onload = async function () {
    try {
        
        const uid = window.localStorage.getItem('uid');
        console.log(uid);
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/users/${uid}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const result = await response.json();

        console.log(response):
      //console.log('User data fetched:', result); // Debugging line
  
      const user = Array.isArray(result) ? result[0] : result; // Assuming user is at index 0, if it's in an array
  
      //console.log('Processed user data:', user);
  
      // Update form fields with user data
      document.getElementById('firstname').value = user.firstname || '';
      document.getElementById('lastname').value = user.lastname || '';
      document.getElementById('race').value = user.race || '';
      document.getElementById('phoneNumber').value = user.phoneNumber || '';
      document.getElementById('age').value = user.age || '';
  
    } catch (error) {
      console.error('Error fetching or parsing user data:', error);
    }
  };
  
