const { db } = require('./init.js');


async function addReport(uid, report){
    const added = true;     // Keeps track of whether or not we added the repoort

    const userRef = db.collection("reports");    //Stores a reference to the user

    await userRef.add({
        firstName : report.firstName,
        lastName: report.lastName,
        geoLocation: report.geoLocation,
        description: report.description,
        location: report.description,
        urgencyLevel: report.urgencyLevel,
        status: report.status,
        reportType: report.reportType,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        imageUrls: report.imageUrls,
        videoUrls: report.videoUrls,
        uid: uid
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



async function getAllReports(){
    const usersRef = db.collection('reports');    // Get a reference to the reports collection

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



async function getUserReport(uid){
    const usersRef = db.collection('articles').where("uid", "==", uid);    // Get a reference to the articles collection

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





module.exports = { addReport, getAllReports, getUserReport  }