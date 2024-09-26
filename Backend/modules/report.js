const { appendNotifications } = require('./notification.js');
const { db } = require('./init.js');


async function addReport(uid, report){
    let added = true;     // Keeps track of whether or not we added the report

    const userRef = db.collection("reports");    //Stores a reference to the user

    await userRef.add({
        geoLocation: report.geoLocation,
        description: report.description,
        location: report.description,
        urgencyLevel: report.urgencyLevel,
        status: report.status,
        timestamp: report.timestamp,
        imageUrls: report.imageUrls,
        videoUrls: report.videoUrls,
        uid: uid
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

        await appendNotifications(idArray, 'added a new report', user2);
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
    const usersRef = db.collection('articles').where("uid", "==", uid);    // Get a reference to the articles collection

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





module.exports = { addReport, getAllReports, getUserReport  }
