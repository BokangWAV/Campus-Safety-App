require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

//import { GooglesignInUser } from 'modules/users.js';
//const { GooglesignInUser } = require('./modules/users.js');
const { getAllArticles, getPendingArticles, getApprovedArticles, addArticle, deleteArticle } = require('./modules/article.js');

app.use(cors());


//-------------------------------------  ARTICLE SECTION  -------------------------------------------------//
// This is to get all the articles in the database
app.get('/articles', async (req, res)=>{
    const result = await getAllArticles();
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
    const title = req.params['title'];
    deleteArticle(name, title);
});





app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
});