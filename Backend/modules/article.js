const { db } = require('./init.js');


async function getAllArticles(){
    const usersRef = db.collection('articles');    // Get a reference to the articles collection

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


async function getPendingArticles(){
    const usersRef = db.collection('articles').where("status", "==", "pending");    // Get a reference to the articles collection

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


async function getApprovedArticles(){
    const usersRef = db.collection('articles').where("status", "==", "approved");    // Get a reference to the articles collection

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


async function addArticle(article){
    let added = true;
    const usersRef = db.collection('articles')
    // Add a new document with a generated id.
    await usersRef.add({
        likes: 0,
        content: article.content,
        surname: article.surname,
        title: article.title,
        name: article.name,
        userID: article.uid,
        status: "pending"
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








module.exports = { getAllArticles, getPendingArticles, getApprovedArticles, addArticle, deleteArticle, addLike };
