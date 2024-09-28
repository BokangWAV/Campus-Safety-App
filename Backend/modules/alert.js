const {db, FieldValue} = require('./init.js');
const { appendNotifications } = require('./notification.js');

async function getAllAlerts(){
    const usersRef = db.collection('alert');    // Get a reference to the articles collection

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


async function addAlert(uid, alert){
    let added = true;

    const reportsRef = db.collection('alert')
    // Add a new document with a generated id.

    var count = await getAllAlerts()
    count = count.length + 1

    await reportsRef.add({
        alertDate: FieldValue.serverTimestamp(),
        details: "EMERGENCY",
        firstName: alert.firstName,
        lastName: alert.lastName,
        status: "processing",
        lat: alert.lat,
        lon: alert.lon,
        age: alert.age,
        race: alert.age,
        phoneNumber: alert.phoneNumber,
        alertID: count,
        uid: uid
    })
    .then(async (docRef) => {
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
            //Do not do anything we just return an empty object
        })

        const usersRef = db.collection('users').where("role", "==", "manager");

        const idArray = []
        await usersRef.get().then(snapshot => {
            if (!snapshot.empty) {
                snapshot.forEach(doc =>{
                    idArray.push(doc.id);
                })
            }
        });

        appendNotifications(idArray, 'requires immediate attention', user, "alert", `${alert.lat} ${alert.lon}`, user.profilePicture);
    })
    .catch((error) => {
        //console.error("Error adding document: ", error);
        added = false;
    });

    return added;
}



async function deleteReport(reportID){
    let deleted = true;
    const usersRef = await db.collection('alert').where("alertID", "==", Number(reportID)).get();

    const doc = usersRef.docs[0];

    const articlesRef2 = db.collection('alert')

    await articlesRef2.doc(doc.id).delete()
    .then(() => {
        //console.log("Document successfully deleted!");
    }).catch((error) => {
        //console.error("Error removing document: ", error);
        deleted = false;
    });

    return deleted;
    
}


async function updateViewAlert(reportID){

    let added = true;
    const articlesRef = await db.collection('alert').where("alertID", "==", Number(reportID)).get();

    const doc = articlesRef.docs[0];

    const articlesRef2 = db.collection('alert')

    await articlesRef2.doc(doc.id).update({
        status: "ASSISTED"
    })
    .then(() => {
        //console.log("Document successfully updated!");
    })
    .catch((error) => {
        // The document probably doesn't exist.
        //console.error("Error updating document: ", error);
        added = false;
    });

    return added;
}

async function getUserAlerts(uid){
    const usersRef = db.collection('alert').where("uid", "==", uid);    // Get a reference to the articles collection

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










module.exports = { getAllAlerts, addAlert, deleteReport, updateViewAlert, getUserAlerts }
