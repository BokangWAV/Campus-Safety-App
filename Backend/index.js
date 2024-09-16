require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

//import { GooglesignInUser } from 'modules/users.js';
//const { GooglesignInUser } = require('./modules/users.js');
const { getAllArticles, getPendingArticles, getApprovedArticles, addArticle, deleteArticle } = require('./modules/article.js');
const {getAllUsers, getUser} = require('./modules/profile.js');

app.use(cors());

app.use(express.static(path.join(__dirname, '../app')));

app.use(express.json());

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
    const title = req.params['title']
    deleteArticle(name, title);
});

//-------------------------------------  PROFILE SECTION  -------------------------------------------------//

app.get('/profile', async (req, res)=>{
    //const result = await getAllUsers();
    //const result = await getUser();
    //res.json(result);
    res.sendFile(path.join(__dirname, '../app', 'profile.html'));
});

app.get('/profile-data', async (req, res) => {
    try {
        const result = await getUser();
        //console.log(result);
        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(result); 
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/update-profile', (req, res) => {
    const userData = req.body;  // Assuming you're using body-parser or express.json()
    console.log('Received user data:', userData);
    
    //would typically save the user data to the database
  
    res.json({ success: true, message: 'Profile updated successfully' });
});
  
app.post('/update-profile-picture', (req, res) => {
    const { profilePicture } = req.body;
    const userId = "some_user_id"; // You would typically get this from authentication
  
    // Update the user profile in your database with the new profilePicture URL
    db.collection('users').doc(userId).update({ profilePicture })
      .then(() => {
        res.json({ success: true, message: 'Profile picture updated successfully' });
      })
      .catch(error => {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile picture' });
      });
  });
  

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
});