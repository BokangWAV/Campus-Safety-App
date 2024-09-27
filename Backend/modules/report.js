const { appendNotifications } = require('./notification.js');
const { db } = require('./init.js');


async function addReport(uid, report){
    let added = true;     // Keeps track of whether or not we added the report

    const userRef = db.collection("reports");    //Stores a reference to the user

    const reportsDatabase = await getAllReports();
    let count = reportsDatabase.length + 1;

    await userRef.add({
        geoLocation: report.geoLocation,
        description: report.description,
        location: report.location,
        urgencyLevel: report.urgencyLevel,
        status: report.status,
        timestamp: report.timestamp,
        imageUrls: report.imageUrls,
        videoUrls: report.videoUrls,
        uid: uid,
        reportID: count,
        removed: false
    })
    .then(async () => {
        var user2 = {};

        const q = db.collection('users').doc(uid);

        await q.get().then((doc) => {
            if (doc.exists) {
                const response = doc.data();
                user2["firstName"] = response.firstName;
                user2["lastName"] = response.lastName;
                user2["profilePicture"] = response.profilePicture;
            }
        }).catch((error) => {
            //Do not do anything we just return an empty object
            console.error("Error writing document: ", error);
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

        appendNotifications(idArray, 'added a new report', user2, 'report', report.location,report.imageUrls );
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        added = false;
    });

    return added;
}



async function getAllReports(){
    const usersRef = db.collection('reports');    // Get a reference to the reports collection

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



async function getUserReport(uid){
    const usersRef = db.collection('reports').where("uid", "==", uid);    // Get a reference to the articles collection

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



async function removeReport(reportID){
    let removal = false;
    const usersRef = await db.collection('reports').where("reportID", "==", reportID).get();    // Get a reference to the articles collection

    const doc = usersRef.docs[0];

    const articlesRef2 = db.collection('articles')

    await articlesRef2.doc(doc.id).update({
        removed: true
    })
    .then(() => {
        removal = true
       // console.log("Document successfully updated!");
    })
    .catch((error) => {
        // The document probably doesn't exist.
        //console.error("Error updating document: ", error);
    });

    return removal;
}





module.exports = { addReport, getAllReports, getUserReport, removeReport  }
