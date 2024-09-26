const {db, FieldValue} = require('./init.js');


async function getAllNotifications(uid){
    const usersRef = db.collection('notifications').where("uid", "==", uid);    // Get a reference to the users collection

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



async function appendNotifications(array, message, user, type, location, incident_image){
    var count = 0;

    //Get the last number of the appended notification
    const q = db.collection('notifications'); // Limit to only the most recent document
    await q.get()
    .then((querySnapshot) => {
        if (!querySnapshot.empty) {
            count = querySnapshot.size
        } else {
            //console.log("No notifications found.");
        }
    })
    .catch((error) => {
        console.error("Error retrieving the latest notification: ", error);
    });


    //Now for each of the stuff add the notification to the database
    array.forEach(async (uid) => {
        count = count +1;
        const userRef = db.collection("notifications");    //Stores a reference to the user

        const reporter = user.firstName +" "+ user.lastName;

        await userRef.add({
            notificationID: count,
            timestamp: FieldValue.serverTimestamp(),
            posted_by_name: reporter,
            profile_pic: user.profilePicture ,
            profile_link: user.profilePicture,
            message: message,
            status: "unread",
            viewer: "",
            uid: uid,
            location: location,
            incident_image: incident_image,
            type: type
        })
        .then(() => {
            //console.log("Document successfully written!");
        })
        .catch((error) => {
            //console.error("Error writing document: ", error);
            added = false;
        });
    });
}


async function getAllReadNotifications(uid){
    const usersRef = db.collection('notifications').where("uid", "==", uid).where("status", "==", "read");    // Get a reference to the users collection

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


async function getAllUnreadNotifications(uid){
    const usersRef = db.collection('notifications').where("uid", "==", uid).where("status", "==", "unread");    // Get a reference to the users collection

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


async function updateNotificationStatus(uid, notificationID){
    let added = true;
    const articlesRef = db.collection('notifications').where("uid", "==", uid).where("notificationID", "==", notificationID);

    await articlesRef.update({
        status: "read"
    })
    .then(async () => {
        //Do nothing
    })
    .catch((error) => {
        // The document probably doesn't exist.
        //console.error("Error updating document: ", error);
        added = false;
    });

    return added;
}



module.exports = { appendNotifications, getAllNotifications, getAllReadNotifications, getAllUnreadNotifications, updateNotificationStatus};
