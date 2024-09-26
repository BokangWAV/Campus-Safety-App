const { db } = require('./init.js');
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
    await reportsRef.add({
        alertDate: firebase.firestore.FieldValue.serverTimestamp(),
        alertNo: count+1,
        details: "EMERGENCY",
        firstName: alert.firstName,
        lastName: alert.lastName,
        status: "processing",
        viewer: "",
        lat: alert.lat,
        lon: alert.lon
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

        appendNotifications(idArray, 'requires immediate attention', user);
    })
    .catch((error) => {
        //console.error("Error adding document: ", error);
        added = false;
    });

    return added;
}



async function deleteReport(reportID){
    let deleted = true;
    const usersRef = db.collection('articles').where("alertNo", "==", reportID);

    await usersRef.delete()
    .then(() => {
        //console.log("Document successfully deleted!");
    }).catch((error) => {
        //console.error("Error removing document: ", error);
        deleted = false;
    });

    return deleted;
    
}


async function updateViewAlert(reportID, report){
    let added = true;
    const articlesRef = db.collection('articles').where("alertNo", "==", reportID);

    await articlesRef.update({
        status: "ASSISTED",
        viewer: report.viewer
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










module.exports = { getAllAlerts, addAlert, deleteReport, updateViewAlert }
