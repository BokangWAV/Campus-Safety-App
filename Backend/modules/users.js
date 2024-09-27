const { db } = require('./init.js');



async function getAllUsers(){
    const usersRef = db.collection('users');    // Get a reference to the users collection

    var result = [];
    // First page of results
    await usersRef.get().then(snapshot => {
        if (!snapshot.empty) {
            snapshot.forEach(doc =>{
                result.push(doc.data());
            })
        }
    });

    return result;
}



async function getUser(uid){
    let result = [];
    var userRef = db.collection("users").doc(uid);

    await userRef.get().then((doc) => {
        if (doc.exists) {
            result.push(doc.data());

        }
    }).catch((error) => {
        //Do not do anything we just return an empty object
    })

    return result;
}



async function addUser(uid, user){
    let added = true;   //Shows whether we added a user or we failed

    const verifyRef = db.collection("users").doc(uid);
    const doc = await verifyRef.get();

    if (doc.exists) {
        return !added;
    }


    const userRef = db.collection("users").doc(uid);    //Stores a reference to the user

    await userRef.set({
        email: user.email,
        role: "user",
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: "",
        age: 0,
        profilePicture: "",
        race: "",
        gender: user.gender
    })
    .then(() => {
        //console.log("Document successfully written!");
    })
    .catch((error) => {
        //console.error("Error writing document: ", error);
        added = false;
    });

    return added;
}


async function updateProfile(uid, user){
    let updated = true;   //Shows whether we updated a user or we failed

    const userRef = db.collection("users").doc(uid);    //Stores a reference to the user

    await userRef.update({
        phoneNumber: user.phoneNumber,
        age: user.age,
        race: user.race
    })
    .then(() => {
       // console.log("Document successfully updated!");
    })
    .catch((error) => {
        // The document probably doesn't exist.
        //console.error("Error updating document: ", error);

        updated = false;
    });

    return updated;
}


async function updateProfilePicture(uid, url){
    let updated = true;   //Shows whether we updated a user or we failed

    const userRef = db.collection("users").doc(uid);    //Stores a reference to the user

    await userRef.update({
        profilePicture: url,
    })
    .then(() => {
       // console.log("Document successfully updated!");
    })
    .catch((error) => {
        updated = false;
    });

    return updated;
}


async function setRole(managerUID, uid, role){
    const changed = false;
    const manager = await getUser(managerUID);

    if(!manager[0].role == "manager"){
        return changed;
    }

    const userRef = db.collection("users").doc(uid);    //Stores a reference to the user

    await userRef.update({
        role: role,
    })
    .then(() => {
       // console.log("Document successfully updated!");
       changed = true;
    })
    .catch((error) => {
        console.error(error);
    });

    return changed;
}






module.exports = { getAllUsers, getUser, addUser, updateProfile, updateProfilePicture, setRole  }
