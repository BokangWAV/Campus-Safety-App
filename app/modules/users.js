import {  signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { collection, addDoc  } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js"; 
import { auth, provider, db } from "./init.js";
import { smoothTRansition } from "../scripts/main.js";

// Build Firebase credential with the Google ID token.
//const credential = GoogleAuthProvider.credential(id_token);


/* FUNCTION: This is a function to login in users with google 
*
*
*/
function GooglesignInUser(){
    signInWithPopup(auth, provider)
    .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const userFirstName = user.displayName.split(" ")[0]; //Name of the user
        const userLastName = user.displayName.split(" ")[1];  //Surname of the user
        const userEmail = user.email;  // Email of the user
        console.log(user.uid);
        console.log(user.displayName.split(" ")[0], user.email);


        window.localStorage.setItem('uid', user.uid);
        const currentUser = {
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName
          };
        //addGoogleUser(userFirstName, userLastName, userEmail);
        await fetch(`http://https://sdp-campus-safety.azurewebsites.net/users/${user.uid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentUser),
          })
        .then(response => response.json())
        .then(data => console.log(data));

        //signOutUser();
        // IdP data available using getAdditionalUserInfo(result)
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        //const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage);
        // ...
    });
}



/*  FUNCTION: This allows users to register with email and password
*
*
*/
async function NormalRegisterUser(firstName, lastName, email, password, pTag){
    //console.log(firstName, lastName, email, password);
    let created = false;
    await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user);

            const currentUser = {
                email: email,
                firstName: firstName,
                lastName: lastName
              };

            window.localStorage.setItem('uid', user.uid);

            await fetch(`http://https://sdp-campus-safety.azurewebsites.net/users/${user.uid}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentUser),
              })
            .then(response => response.json())
            .then(data => created = true);

            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //console.log(errorCode,errorMessage);

            pTag.innerText = 'Invalid Details';
            smoothTRansition();
            // Trigger the transition
            requestAnimationFrame(() => {
            pTag.className = 'message show';
            });
        });
    return created;
}



async function NormalSignInUser(email, password, pTag){
    let signed = false;
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            //console.log(user);
            const uid = user.uid;
            window.localStorage.setItem('uid', uid);
            // ...

            signed = true;
            console.log(signed);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //console.log(errorCode,errorMessage);
            pTag.innerText = 'Invalid email/password';
            smoothTRansition();
            // Trigger the transition
            requestAnimationFrame(() => {
            pTag.className = 'message show';
            });
        });
    console.log(signed);
    return signed;
}


/*  FUNCTION: This adds user to the database after normal login
*
*
*/
async function addNormalUser(name, surname, email){
    const docRef = await addDoc(collection(db, "users"), {
        firstName: name,
        lastName: surname,
        email: email,
        profile: {},
        password: ""
    });
}




/* FUNCTION: This will add the user who logged in with google to login
*
*
*/
async function addGoogleUser(name, surname, email){
    const docRef = await addDoc(collection(db, "users"), {
        firstName: name,
        lastName: surname,
        email: email,
        profile: {},
        password: ""
    });
      //console.log("Document written with ID: ", docRef.id);
}




function signOutUser(){
    signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    });
}


export { GooglesignInUser, NormalRegisterUser, NormalSignInUser }
