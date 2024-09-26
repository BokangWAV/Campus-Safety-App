

async function  loadData() {
    try {
         const uid = window.localStorage.getItem('uid');
        console.log(uid);
        const response = await fetch(`https://sdp-campus-safety.azurewebsites.net/users/${uid}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const result = await response.json();
      console.log('User data fetched:', result); // Debugging line
  
      const user = Array.isArray(result) ? result[0] : result;  // Assuming user is at index 0, if it's in an array
      
      //console.log('Processed user data:', user);
  
      // Update the profile picture
      document.getElementById('profilePic').src = `${user.profilePicture}`; //|| 'assets/img/default.jpg'
      console.log(user.profilePicture)
  
      // Update name, race, phone, email, and other information
      document.getElementById('name').innerText = `${user.firstName || 'First Name'} ${user.lastName || 'Last Name'}`;
      document.getElementById('race').innerText = `Race: ${user.race || 'Unknown'}`;
      document.getElementById('phone').innerText = `Phone: ${user.phoneNumber || 'Not Provided'}`;
      document.getElementById('email').innerText = `Email: ${user.email || 'Not Provided'}`;
      document.getElementById('studentId').innerText = `Age: ${user.age || 'Not Provided'}`;
    } catch (error) {
      console.error('Error fetching or parsing user data:', error);
    }
  };



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
  console.log("sending requests")
  const uploadPromises = Array.from(files).map(file => {
    const storageRef = storage.ref(`${folderName}/${file.name}`);
    return storageRef.put(file).then(snapshot => snapshot.ref.getDownloadURL());
  });
  return Promise.all(uploadPromises);
}

const imageUploader = document.getElementById('imageUpload')

imageUploader.addEventListener('change',async ()=>{
  const imageFiles = document.getElementById("imageUpload").files;

  let imageUrls = [];

  if (imageFiles.length > 0) {
    console.log("uploading...");
    console.log(imageFiles)
    imageUrls = await uploadFiles(imageFiles, 'profilePicture');
  }

  try {
    console.log("uploaded and updating user details....")
    const bodyElement = { url: imageUrls[0]}
    const uid = window.localStorage.getItem('uid');
    await fetch(`https://sdp-campus-safety.azurewebsites.net/user/profilePicture/${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyElement),
    })
    .then(() => {
      //Show user profile
      loadData()
    }).catch((error)=>{
      console.error(error)
    });
  } catch (error) {
    
  }
})
  
