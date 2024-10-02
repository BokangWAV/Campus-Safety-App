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

    const response = await usersRef.orderBy("articleID", "desc").get();
    var count = 0;
    if( response.docs.length > 0){
        count = Number(response.docs[0].data().articleID)
    }
    
    count = count + 1
    // Add a new document with a generated id.
    await usersRef.add({
        articleID: count,
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
            console.error(error)
        })


        const usersRef = db.collection('users').where("role", "==", "manager");

        const idArray = []
        await usersRef.get().then(snapshot => {
            if (!snapshot.empty) {
                snapshot.forEach(doc =>{
                    if(doc.id != uid)idArray.push(doc.id);
                })
            }
        }).catch(error=>{ console.error(error)});

        console.log(`Article ${article.title} added successfully`);
        if(idArray.length>0)appendNotifications(idArray, `${title} article requires approval`, user,'article', 'Not specified', user.profilePicture );
    })
    .catch((error) => {
        //console.error("Error adding document: ", error);
        added = false;
    });

    return added;
}


async function deleteArticle(uid){
    let deleted = true;
    const usersRef = await db.collection('articles').where("articleID", "==", Number(uid)).get();
    const doc = usersRef.docs[0];

    const articlesRef2 = db.collection('articles')

    await articlesRef2.doc(doc.id).delete()
    .then(() => {
        console.log(`Article ${uid} successfully deleted!`);
    }).catch((error) => {
        console.error("Error removing document: ", error);
        deleted = false;
    });

    return deleted;
    
}


async function getArticle(uid){
    let response = {}
    const usersRef = db.collection('articles').where("articleID", "==", Number(uid));

    await usersRef.get()
    .then((snapshot) => {
        if (!snapshot.empty) {
            snapshot.forEach(doc =>{
                response = doc.data();
            })
        }
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });


    return response;
}



async function addLike(uid){

    let added = true;
    const articlesRef =  await db.collection('articles').where("articleID", "==", Number(uid)).get();
    const article = await getArticle(uid);
    const numLikes = Number(article.likes) + 1;

    const doc = articlesRef.docs[0];

    const articlesRef2 = db.collection('articles')

    await articlesRef2.doc(doc.id).update({
        likes: numLikes
    })
    .then(() => {
        console.log(`Article ${uid} successfully updated to ${numLikes} Likes!`);
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        added = false;
    });

    return added;

}


async function approveArticle(uid){

    let added = true;
    const articlesRef = await db.collection('articles').where("articleID", "==", Number(uid)).get();

    const doc = articlesRef.docs[0];

    const articlesRef2 = db.collection('articles')

    await articlesRef2.doc(doc.id).update({
        status: "approved"
    })
    .then(async () => {
        console.log(`Article ${uid} has been approved`);   
    })
    .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        added = false;
    });

    return added;
}








module.exports = { getAllArticles, getPendingArticles, getApprovedArticles, addArticle, deleteArticle, addLike, approveArticle };
