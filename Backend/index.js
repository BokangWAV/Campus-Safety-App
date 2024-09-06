require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

//import { GooglesignInUser } from 'modules/users.js';
//const { GooglesignInUser } = require('./modules/users.js');
const { getAllArticles, getPendingArticles, getApprovedArticles, addArticle, deleteArticle } = require('./modules/article.js');

app.use(cors());


console.log("Setting up the firebase admin")
var admin = require("firebase-admin");

var serviceAccount = require("./cert.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase Admin setup")

const db = admin.firestore();

app.get('/', async (req, res)=>{
    console.log("sending the query");
    const usersRef = db.collection('users');

    // First page of results
    usersRef.get().then(snapshot => {
        console.log("The snapshot has been returned");
        if (!snapshot.empty) {
            var count =0;
            var result = {};
            console.log("Formating the response");
            snapshot.forEach(doc =>{
                result[count] = doc.data();
                count++;
            })
            console.log("Response formatted and ready to be sent back to user");
            res.json(result);
            console.log("Done");
        }
    });

});





//-------------------------------------  ARTICLE SECTION  -------------------------------------------------//
// This is to get all the articles in the database
app.get('/articles', async (req, res)=>{
    console.log("Sending request to get the Articles");
    const result = await getAllArticles();
    console.log("Got the articles");
    res.json(result);
});

app.get('/articles/Pending', async (req, res)=>{
    const result = await getPendingArticles();
    res.json(result);
});

app.get('/articles/Approved', async (req, res)=>{
    const result = await getApprovedArticles();
    res.json(result);
});

app.post('/articles', async (req, res) =>{
    const article = req.body;
    if(addArticle(article)){
        res.status(200);
    }else{
        res.status(404);
    }
});

app.delete('/articles/:name/:title', async (req, res)=>{
    const name = req.params['name'];
    const title = req.params['title']
    deleteArticle(name, title);
});





app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
});