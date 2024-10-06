const {db, FieldValue} = require('./init.js');
const { appendNotifications } = require('./notification.js');
const { setRole} = require('./users.js')

async function getApplications(){
    const usersRef = db.collection('application');    // Get a reference to the articles collection

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

async function addApplication(uid){
    let added = true;

    var applicationUser;
    const q = db.collection('users').doc(uid);

    await q.get().then((doc) => {
        if (doc.exists) {
            const response = doc.data();
            applicationUser = response;
        }
    }).catch((error) => {
        console.error(error)
        //Do not do anything we just return an empty object
    })

    const reportsRef = db.collection('application')
    // Add a new document with a generated id.

    const response = await reportsRef.orderBy("applicationID", "desc").get();
    var count = 0;
    if( response.docs.length > 0){
        count = Number(response.docs[0].data().applicationID)
    }
    
    count = count + 1
    console.log(count);
    console.log(applicationUser);
    console.log(uid);

    await reportsRef.add({
        applicationID: count,
        uid: uid,
        firstName: applicationUser.firstName,
        lastName: applicationUser.lastName,
        age: applicationUser.age,
        race: applicationUser.race,
        gender: applicationUser.gender,
        phoneNumber: applicationUser.phoneNumber,
        status: "pending",
    })
    .then(async (docRef) => {
        console.log("Application sent")
        var user = {};

        const q = db.collection('users').doc(uid);

        await q.get().then((doc) => {
            if (doc.exists) {
                const response = doc.data();
                user["firstName"] = response.firstName;
                user["lastName"] = response.lastName;
                user["profilePicture"] = response.profilePicture;
                user["race"] = response.race;
                user["age"] = response.age;
                user["phoneNumber"] = response.phoneNumber
            }
        }).catch((error) => {
            console.error(error)
            //Do not do anything we just return an empty object
        })

        const usersRef = db.collection('users').where("role", "==", "manager");

        const idArray = []
        await usersRef.get().then(snapshot => {
            if (!snapshot.empty) {
                snapshot.forEach(doc =>{
                    if(doc.id != uid)idArray.push(doc.id);
                })
            }
        }).catch(error=>{
            console.error(error);
        });

        //console.log(idArray)
      
        appendNotifications(idArray, `${user.firstName} ${user.lastName} requested to be a manager`, user, 'Application', `Not specified`,"" );


    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        added = false;
    });

    return added;
}

async function approveApplication(uid, status, applicationID, managerID){
    
    let added = true;
    const articlesRef = await db.collection('application').where("uid", "==", uid).where("applicationID", "==", Number(applicationID)).get();

    const doc = articlesRef.docs[0];

    const articlesRef2 = db.collection('application')

    await articlesRef2.doc(doc.id).update({
        status: status
    })
    .then(() => {
        console.log("Application status successfully updated!");
        if(status === "rejected"){
            //Do nothin just set the application status to rejected
        }else{
            setRole(managerID, uid, "manager");
        }
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        added = false;
    });

    return added;
}


async function getApplication(uid){
    const usersRef = db.collection('application').where("uid", "==", uid);    // Get a reference to the articles collection

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




module.exports = { getApplications,  addApplication,  approveApplication, getApplication}
