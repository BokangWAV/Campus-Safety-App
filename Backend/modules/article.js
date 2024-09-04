const { auth, provider, db } = require('./init.js');
const { collection, getDocs, query, where, and, deleteDoc } = require('firebase/firestore');

async function getAllArticles(){
    console.log("Getting the articles");
    const q = query(collection(db,'articles'));
    const snapshot = await getDocs(q);
    console.log("Got the articles");

    var count =0;
    var result = {};
    snapshot.forEach(doc =>{
        console.log("Here is the first data", doc.data());
        result[count] = doc.data();
        count++;
    })
    console.log("Done");
    return result;
}


async function getPendingArticles(){
    const q = query(collection(db, 'articles'), where('status', '==','pending'));
    const snapshot = await getDocs(q);

    var count =0;
    var result = {};
    snapshot.forEach(doc =>{
        result[count] = doc.data();
        count++;
    })
    return result;
}


async function getApprovedArticles(){
    const q = query(collection(db, 'articles'), where('status', '==','approved'));
    const snapshot = await getDocs(q);

    var count =0;
    var result = {};
    snapshot.forEach(doc =>{
        result[count] = doc.data();
        count++;
    })
    return result;
}


async function addArticle(article){
    try {
        const query = collection(db, 'articles');
        const docref = await addDoc(query, {
            likes: 0,
            content: article.content,
            surname: article.surname,
            title: article.title,
            name: article.name,
            article_id:5,
            status: pending
        });

        return true;
    } catch (error) {
        console.error('Error adding article:', error);
        return false;
    }
}


async function deleteArticle(name, title){
    try {
        const query = query(collection(db, 'articles'), where('name', '==', name), where('title','==',title));
        const snapshot = await getDocs(query);
        await deleteDoc(snapshot.docs[0].ref)
        .then(()=>{
            //succefull
        }).catch((error)=>{
            console.log(error);
        });
    } catch (error) {
        console.log(error);
    }
    
}








module.exports = { getAllArticles, getPendingArticles, getApprovedArticles, addArticle, deleteArticle };