import { signOutUser } from "../modules/users.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js"
import { auth } from "../modules/init.js";

async function fetchData(url) {
  try {
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

async function  loadData() {
    try {
      if(window.localStorage.getItem('uid') === null){
        alert("You need to sign in");
        window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/register.html"
      }
      
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
      console.log('User data fetched:', result); // Debugging line
  
      const user = Array.isArray(result) ? result[0] : result;  // Assuming user is at index 0, if it's in an array
      
      //console.log('Processed user data:', user);
      window.localStorage.setItem('userFirstName', user.firstName)
      window.localStorage.setItem('userLastName', user.lastName)
      window.localStorage.setItem('userAge', user.age)
      window.localStorage.setItem('userRace', user.race)
      window.localStorage.setItem('userGender', user.gender)
      window.localStorage.setItem('userPhoneNumber', user.phoneNumber)
      window.localStorage.setItem('userProfile', user.profilePicture)
  
      // Update the profile picture
      document.getElementById('profilePic').src = `${user.profilePicture}`; //|| 'assets/img/default.jpg'
      console.log(user.profilePicture)
  
      // Update name, race, phone, email, and other information
      document.getElementById('name').innerText = `${user.firstName || 'First Name'} ${user.lastName || 'Last Name'}`;
      document.getElementById('race').innerText = `Race: ${user.race || 'Unknown'}`;
      document.getElementById('phone').innerText = `Phone: ${user.phoneNumber || 'Not Provided'}`;
      document.getElementById('email').innerText = `Email: ${user.email || 'Not Provided'}`;
      if(!user.gender == ''){
        document.getElementById('gender').innerText = `Gender: ${user.gender}`;
      }
      document.getElementById('studentId').innerText = `Age: ${user.age || 'Not Provided'}`;
      document.getElementById('role').innerText = `Role: ${user.role}`;


    } catch (error) {
      console.error('Error fetching or parsing user data:', error);
    }
  };



  document.querySelector("#logOut").addEventListener("click", async ()=>{
    await signOutUser();
    window.location.href = "https://agreeable-forest-0b968ac03.5.azurestaticapps.net/register.html";
    
  })
window.onload = loadData;


// await fetch(`http://localhost:8080/user/profilePicture/${uid}`, {
//   method: 'PUT',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(bodyElement),
// })
// .then(() => {
//   //Show user profile
//   loadData()
// }).catch((error)=>{
//   console.error(error)
// });


const firebaseConfig = {
  apiKey: "AIzaSyCLDopG2959mh9Wtl3nDM0FAWZBNc3GGLo",
  authDomain: "tdkus-fcf53.firebaseapp.com",
  projectId: "tdkus-fcf53",
  storageBucket: "tdkus-fcf53.appspot.com",
  messagingSenderId: "144411393779",
  appId: "1:144411393779:web:54a4013e6da2a974b4c186",
  measurementId: "G-5BPYZE953B"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

async function uploadFiles(files, folderName) {
  console.log("Sending requests to upload files...");
  const uploadPromises = Array.from(files).map(file => {
    const storageRef = storage.ref(`${folderName}/${file.name}`);
    return storageRef.put(file)
      .then(snapshot => {
        console.log(`Uploaded file: ${file.name}`);
        return snapshot.ref.getDownloadURL();
      })
      .catch(error => {
        console.error(`Error uploading file ${file.name}:`, error);
        throw error;
      });
  });
  return Promise.all(uploadPromises);
}

// Handle image upload
const imageUploader = document.getElementById('imageUpload');

imageUploader.addEventListener('change', async () => {
  const imageFiles = document.getElementById("imageUpload").files;
  let imageUrls = [];

  if (imageFiles.length > 0) {
    console.log("Uploading image files:", imageFiles);
    try {
      imageUrls = await uploadFiles(imageFiles, 'profilePicture');
    } catch (error) {
      console.error("Error during image upload:", error);
      return; // Stop further execution if image upload fails
    }
  }

  try {
    if (imageUrls.length > 0) {
      console.log("Images uploaded, updating user profile...");
      const bodyElement = { url: imageUrls[0] };

      const uid = window.localStorage.getItem('uid');
      const token = window.localStorage.getItem('accessToken');
      await fetch(`https://sdp-campus-safety.azurewebsites.net/user/profilePicture/${uid}`, {
          method: 'PUT',
          headers: {
              userid:uid,
              authtoken: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyElement),
        })
      
      // await fetch(`https://sdp-campus-safety.azurewebsites.net/user/profilePicture/${uid}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(bodyElement),
      // });
      
      console.log("User profile updated successfully.");
      loadData(); // Reload the updated profile data
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
});


onAuthStateChanged(auth, (user) => {
  if (user) {
      window.localStorage.setItem('accessToken', user.accessToken)
  }
});

