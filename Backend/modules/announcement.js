const { appendNotifications } = require('./notification.js');
const {db, FieldValue} = require('./init.js');


async function sendAnnouncement(uid, announcement){
    let added = true;     // Keeps track of whether or not we added the report

    const userRef = db.collection("annuoncements");    //Stores a reference to the user

    const response = await userRef.orderBy("announcementID", "desc").get();
    var count = 0;
    if( response.docs.length > 0){
        count = Number(response.docs[0].data().announcementID)
    }
    
    count = count + 1

    await userRef.add({
        announcementID: count,
        title: announcement.title,
        announcement: announcement.message,
        firstName: announcement.firstName,
        lastName: announcement.lastName,
        profilePicture: announcement.profilePicture,
        uid: uid
    })
    .then(async () => {
        var user2 = {};
        user2["firstName"] = announcement.firstName;
        user2["lastName"] = announcement.lastName;
        user2["profilePicture"] = announcement.profilePicture;

        

        const usersRef = db.collection('users');

        const idArray = []
        await usersRef.get().then(snapshot => {
            if (!snapshot.empty) {
                snapshot.forEach(doc =>{
                    if(doc.id != uid)idArray.push(doc.id);
                })
            }
        });

        appendNotifications(idArray, `${announcement.title}, ${announcement.message}`, user2, 'announcement', '' , null );
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
        added = false;
    });

    return added;
}


module.exports ={ sendAnnouncement }