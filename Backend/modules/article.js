const { db } = require('./init.js');
const { appendNotifications } = require('./notification.js');


async function getAllArticles(){
    const usersRef = db.collection('articles');    // Get a reference to the articles collection

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


async function getPendingArticles(){
    const usersRef = db.collection('articles').where("status", "==", "pending");    // Get a reference to the articles collection

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


async function getApprovedArticles(){
    const usersRef = db.collection('articles').where("status", "==", "approved");    // Get a reference to the articles collection

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


async function addArticle(uid, article){
    let added = true;
    const usersRef = db.collection('articles')
    // Add a new document with a generated id.
    await usersRef.add({
        likes: 0,
        content: article.content,
        surname: article.surname,
        title: article.title,
        name: article.name,
        userID: uid,
        status: "pending"
    })
    .then(async (docRef) => {
        var user = {};

        const q = db.collection('users').doc(article.uid);

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

        console.log(user);

        const usersRef = db.collection('users').where("role", "==", "manager");

        const idArray = []
        await usersRef.get().then(snapshot => {
            if (!snapshot.empty) {
                snapshot.forEach(doc =>{
                    idArray.push(doc.id);
                })
            }
        });

        appendNotifications(idArray, `${title} article requires approval`, user);
    })
    .catch((error) => {
        //console.error("Error adding document: ", error);
        added = false;
    });

    return added;
}


async function deleteArticle(uid, title){
    let deleted = true;
    const usersRef = db.collection('articles').where("userID", "==", uid).where("title", "==", title);

    await usersRef.delete()
    .then(() => {
        //console.log("Document successfully deleted!");
    }).catch((error) => {
        //console.error("Error removing document: ", error);
        deleted = false;
    });

    return deleted;
    
}


async function getArticle(name, title){
    let response = {}
    const usersRef = db.collection('articles').where("name", "==", name).where("title", "==", title);

    await usersRef.get()
    .then((snapshot) => {
        if (!snapshot.empty) {
            snapshot.forEach(doc =>{
                result = doc.data();
            })
        }
    }).catch((error) => {
        //console.error("Error removing document: ", error);
    });

    return response;
}



async function addLike(name, title){
    let added = true;
    const articlesRef = db.collection('articles').where("name", "==", name).where("title", "==", title);
    const article = await getArticle(name, title);
    const numLikes = article.likes + 1;

    await articlesRef.update({
        likes: numLikes
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


async function approveArticle(name, title){
    let added = true;
    const articlesRef = db.collection('articles').where("name", "==", name).where("title", "==", title);

    await articlesRef.update({
        status: "approved"
    })
    .then(async () => {
        var user = {};

        const q = db.collection('users').doc(article.uid);

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

        console.log(user);

        const usersRef = db.collection('users').where("role", "==", "manager");

        const idArray = []
        await usersRef.get().then(snapshot => {
            if (!snapshot.empty) {
                snapshot.forEach(doc =>{
                    idArray.push(doc.id);
                })
            }
        });

        await appendNotifications(idArray, `article ${title} has been approved`, user);
    })
    .catch((error) => {
        // The document probably doesn't exist.
        //console.error("Error updating document: ", error);
        added = false;
    });

    return added;
}








module.exports = { getAllArticles, getPendingArticles, getApprovedArticles, addArticle, deleteArticle, addLike, approveArticle };
