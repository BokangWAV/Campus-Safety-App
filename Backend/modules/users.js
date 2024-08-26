const { collection, addDoc } = require('firebase/firestore');
const { auth, provider, db } = require('./init.js');


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







module.exports = {  }