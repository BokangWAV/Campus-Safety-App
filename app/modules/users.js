import {  signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js"; 
import { auth, provider} from "./init.js";
import { smoothTRansition } from "../scripts/main.js";

// Build Firebase credential with the Google ID token.
//const credential = GoogleAuthProvider.credential(id_token);


/* FUNCTION: This is a function to login in users with google 
*
*
*/
async function GooglesignInUser(){
    let created = false;
    
    await signInWithPopup(auth, provider)
    .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        console.log(result);
        const user = result.user;
        const userFirstName = user.displayName.split(" ")[0]; //Name of the user
        const userLastName = user.displayName.split(" ")[1];  //Surname of the user
        const userEmail = user.email;  // Email of the user
        const userGender = ""
        //console.log(user.uid);
        //console.log(user.displayName.split(" ")[0], user.email);


        window.localStorage.setItem('uid', user.uid);
        const currentUser = {
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName,
            gender: userGender
          };

        window.localStorage.setItem('user', currentUser);
        //addGoogleUser(userFirstName, userLastName, userEmail);
        await fetch(`https://sdp-campus-safety.azurewebsites.net/users/${user.uid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentUser),
          })
        .then(() => {
            created = true;
            //console.log("added");
        }).catch((error)=>{
            console.error(error)
        });

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

    return created;
}



/*  FUNCTION: This allows users to register with email and password
*
*
*/
async function NormalRegisterUser(firstName, lastName, email, password, pTag, gender){
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
                lastName: lastName,
                gender: gender
              };

            window.localStorage.setItem('uid', user.uid);
            window.localStorage.setItem('user', currentUser);

            //console.log("fetching");
            await fetch(`https://sdp-campus-safety.azurewebsites.net/users/${user.uid}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentUser),
              })
            .then(() => {
                created = true;
                //console.log("added");
            })
            .catch((error)=>{
                console.error(error)
            });
            console.log("fetching");

            
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
            //console.log(signed);
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


function iterateLocalStorage() {
    if (typeof(Storage) !== "undefined") {
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            const value = window.localStorage.removeItem(key);
            console.log(`${key}: ${value}`);
        }
    } else {
        console.log("Local storage is not supported in this browser.");
    }
  }



  async function signOutUser() {
    try {
        await signOut(auth);
        iterateLocalStorage();
        console.log("Sign-out successful.");
    } catch (error) {
        console.error("Sign-out error:", error.message);
        alert("An error occurred during sign-out. Please try again.");
    }
}



export { GooglesignInUser, NormalRegisterUser, NormalSignInUser, signOutUser }
