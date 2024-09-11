const { db } = require('./init.js');

async function getAllAlerts(){
    const usersRef = db.collection('alert');    // Get a reference to the articles collection

    var result = {};
    // First page of results
    await usersRef.get().then(snapshot => {
        if (!snapshot.empty) {
            var count =0;
            
            snapshot.forEach(doc =>{
                result[count] = doc.data();
                count++;
            })
        }
    });

    return result;
}


async function addAlert(user){
    let added = true;

    const usersRef = db.collection('alert');    // Get a reference to the articles collection

    var count = 0;
    await usersRef.get().then(snapshot => {
        if (!snapshot.empty) {
            snapshot.forEach(doc =>{
                result[count] = doc.data();
                count++;
            })
        }
    });



    const reportsRef = db.collection('alert')
    // Add a new document with a generated id.
    await reportsRef.add({
        alertDate: firebase.firestore.FieldValue.serverTimestamp(),
        alertNo: count+1,
        details: "EMERGENCY",
        firstName: user.firstName,
        lastName: user.lastName,
        status: "processing",
        viewer: ""
    })
    .then((docRef) => {
        //console.log("Document written with ID: ", docRef.id);
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
        status: "processed",
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
