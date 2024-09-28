const {db, FieldValue} = require('./init.js');
const { getUser} = require('./users.js')



async function getAllFAQ(){
    const usersRef = db.collection('FAQ');    // Get a reference to the users collection

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

async function getUserFAQ(uid){
    const usersRef = db.collection('FAQ').where("uid", "==", uid);    // Get a reference to the articles collection

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

async function respondFAQ(FAQID, answer){

    let responded = false;
    const usersRef = await db.collection('FAQ').where("FAQID", "==", Number(FAQID)).get();    // Get a reference to the articles collection

    const doc = usersRef.docs[0];

    const articlesRef2 = db.collection('FAQ')

    await articlesRef2.doc(doc.id).update({
        answer: answer
    })
    .then(() => {
        responded = true
       // console.log("Document successfully updated!");
    })
    .catch((error) => {
        // The document probably doesn't exist.
        //console.error("Error updating document: ", error);
    });

    return responded;
}

async function  displayFAQ(FAQID){

    let displayable = false;
    const usersRef = await db.collection('FAQ').where("FAQID", "==", Number(FAQID)).get();    // Get a reference to the articles collection

    const doc = usersRef.docs[0];

    const articlesRef2 = db.collection('FAQ')

    await articlesRef2.doc(doc.id).update({
        status: "display"
    })
    .then(() => {
        displayable = true
       // console.log("Document successfully updated!");
    })
    .catch((error) => {
        // The document probably doesn't exist.
        //console.error("Error updating document: ", error);
    });

    return displayable;
}

async function deleteFAQ(FAQID){
    let deleted = true;
    const usersRef = await db.collection('FAQ').where("FAQID", "==", Number(FAQID)).get();

    const doc = usersRef.docs[0];

    const articlesRef2 = db.collection('FAQ')

    await articlesRef2.doc(doc.id).delete()
    .then(() => {
        //console.log("Document successfully deleted!");
    }).catch((error) => {
        //console.error("Error removing document: ", error);
        deleted = false;
    });

    return deleted;
}

async function addFAQ(FAQ){
    let added = true;   //Shows whether we added a user or we failed

    const verifyRef = db.collection("FAQ").doc(uid);


    var count = await getAllFAQ()
    var count = count.length + 1

    await verifyRef.add({
        question: FAQ.question,
        answer: "",
        FAQID: count,
        status: "pending"
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



module.exports =  {getAllFAQ, getUserFAQ, respondFAQ, displayFAQ, deleteFAQ,  addFAQ}
