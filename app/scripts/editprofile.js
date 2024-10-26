import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js"
import { auth } from "../modules/init.js";

window.onload = async function () {
    try {
        
      const uid = window.localStorage.getItem('uid');
      const token = window.localStorage.getItem('accessToken');
      const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/users/${uid}`, {
          method: 'GET',
          headers: {
              userid:uid,
              authtoken: token,
            'Content-Type': 'application/json',
          }
        })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const result = await response.json();

        console.log(result)
      //console.log('User data fetched:', result); // Debugging line
  
      const user = Array.isArray(result) ? result[0] : result; // Assuming user is at index 0, if it's in an array
  
      //console.log('Processed user data:', user);
      window.localStorage.setItem('userFirstName', user.firstName)
      window.localStorage.setItem('userLastName', user.lastName)
      window.localStorage.setItem('userAge', user.age)
      window.localStorage.setItem('userRace', user.race)
      window.localStorage.setItem('userGender', user.gender)
      window.localStorage.setItem('userPhoneNumber', user.phoneNumber)
      window.localStorage.setItem('userProfile', user.profilePicture)
      window.localStorage.setItem('userRole', user.role)

      if(window.localStorage.getItem('userProfile') != ""){
        document.getElementById('profileDisplay').src = window.localStorage.getItem('userProfile');
      
      if( user.profileIntro){
        document.getElementById('fullIntroDiv').style.display = 'flex';
      }
    }
    if(window.localStorage.getItem('userRole') == "manager"){
      document.getElementById('managerAlert').style.display = 'flex'
      document.getElementById('managerRequests').style.display = 'flex'
    }
  
      // Update form fields with user data
      document.getElementById('firstname').value = user.firstName || '';
      document.getElementById('lastname').value = user.lastName || '';
      document.getElementById('race').value = user.race || '';
      document.getElementById('phoneNumber').value = user.phoneNumber || '';
      document.getElementById('age').value = user.age || '';

      if(window.localStorage.getItem("userRole") == 'manager'){
        document.querySelector("#managerReq").style.display = "none"
      }else{
        const uid = window.localStorage.getItem('uid');
        const token = window.localStorage.getItem('accessToken');
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/applications/${uid}`, {
            method: 'GET',
            headers: {
                userid:uid,
                authtoken: token,
              'Content-Type': 'application/json',
            }
          })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        const result = await response.json();
        console.log(result);
        if(result.length != 0){
        console.log(result[0].status);
      }
        if(result.length == 0){
          document.querySelector("#managerReq").addEventListener("click",async function(event){
            document.querySelector("#managerReq").style.cursor = "pointer"
            try{
              const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/applications/${uid}`, {
                method: 'POST',
                headers: {
                    userid:uid,
                    authtoken: token,
                  'Content-Type': 'application/json',
                }
              })

              if(response.ok){
                alert("Application has been successful. Response to be granted by managers.");
                let concernedDiv = document.querySelector(".role-change-div");
                concernedDiv.querySelector("#managerReq").remove();
                let par = document.createElement("p");
                par.style.padding = "7vw 10vh";
                par.style.minWidth = "70%";
                par.style.margin = "0 5%";
                par.style.fontWeight = "700";
                par.textContent = "Your application to be a manager is currently being reviewed.";
                concernedDiv.appendChild(par);
              }else{
                alert("Error in applying for role change. Please try again");
              }
            }catch(error){
              console.error(error);
            }
          })
        }else{
          document.querySelector("#managerReq").style.cursor = "pointer"
          let concernedDiv = document.querySelector(".role-change-div");
          concernedDiv.querySelector("#managerReq").remove();
          let par = document.createElement("p");
          par.style.padding = "7vw 10vh";
          par.style.minWidth = "70%";
          par.style.margin = "0 5%";
          if(result[0].status == "approved"){
            par.textContent = "Your application was approved.";
          }else if(result[0].status == "rejected"){
            par.style.color = "red";
            par.textContent = "Unfortunately, your application was rejected.";
          }else{
            par.textContent = "Your application to be a manager is currently being reviewed.";
          }
          concernedDiv.appendChild(par);
        }
      }
    } catch (error) {
        console.error('Error fetching or parsing user data:', error);
      
    }  
  };



onAuthStateChanged(auth, (user) => {
  if (user) {
      window.localStorage.setItem('accessToken', user.accessToken)
  }
});
    
