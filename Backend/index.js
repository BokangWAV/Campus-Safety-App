require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Get all functions to operate on articles
const { getAllArticles, getPendingArticles, getApprovedArticles, addArticle, deleteArticle, addLike } = require('./modules/article.js');

// Get all the functions to operate on users
const {getAllUsers, getUser, addUser, updateProfile, updateProfilePicture} = require('./modules/users.js');

//Get all the functions to use for Reports
const { addReport, getAllReports, getUserReport } = require('./modules/report.js');

//Get all the functions to use for Alerts
const { getAllAlerts, addAlert, deleteReport, updateViewAlert } = require('./modules/alert.js');

//Get all the functions to use for Notifications
const { getAllNotifications, getAllReadNotifications, getAllUnreadNotifications, updateNotificationStatus } = require('./modules/notification.js');


app.use(cors());
app.use(express.json())


//----------------------------------- WELCOME THE USERS TO THE API ---------------------------------------//
app.get('/', async (req, res)=>{
    res.json({message: "Welcome to the Campus Safety API"});    //Json response to Welcome the person querying
});



//------------------------------------- USER SECTION -----------------------------------------------------//
//Get all user in the database
app.get('/users', async (req, res)=>{
    const response = await getAllUsers();   //Calls function to get all users
    res.json(response); //Return the response
});

//Get user using their uid
app.get('/users/:uid', async (req, res)=>{
    const uid = req.params['uid'];  //Gets the user id from the parameters
    const response = await getUser(uid);    //Calls function to get that specific user
    res.json(response); //Return the response
});

//Add a user to the database
app.post('/users/:uid', async (req, res)=>{
    const uid = req.params['uid'];  //Gets the uid passed from the parameter
    const user = req.body;  //These are the details of the user


    //If the user is added then all is well send response code 200
    //Else send an error
    if(await addUser(uid, user)){
        res.status(200).send('User added successfully');
    }else{
        res.status(404).send('Unable to add user');
    }
    
});

//Update user profile details
app.put('/users/profile/:uid', async (req, res)=>{
    const uid = req.params['uid'];  //Gets the uid passed from the parameter
    const user = req.body;  //These are the details of the user

    //If the user is details is updated then all is well send response code 200
    //Else send an error
    if(await updateProfile(uid, user)){
        res.status(200).send('Updated profile successfully');
    }else{
        res.status(404).send('Unable to update profile');
    }
    
});

//Update the profile picture of the user
app.put('/user/profilePicture/:uid', async (req, res)=>{
    
    const uid = req.params['uid'];  //Gets the uid passed from the parameter
    const profileURL = req.body;  //This is the URL to the profile picture

    //If the user profile is updated then all is well send response code 200
    //Else send an error
    if(await updateProfilePicture(uid, profileURL)){
        res.status(200).send('Updated Profile Picture successfully');
    }else{
        res.status(404).send('Unable to update Profile Picture');
    }
})



//-------------------------------------  ARTICLE SECTION  -------------------------------------------------//
// This is to get all the articles in the database
app.get('/articles', async (req, res)=>{
    const result = await getAllArticles();  // Call the function to get all the articles
    res.json(result);   //Return the results of that action
});

//Get all the pending articles
app.get('/articles/Pending', async (req, res)=>{
    const result = await getPendingArticles();  //Call function to get all articles that are pending
    res.json(result);   //Return the reponse of that action
});

//Get all the approved articles
app.get('/articles/Approved', async (req, res)=>{
    const result = await getApprovedArticles(); //Call function to get all articles that are approved
    res.json(result);   //Return the reponse of that action
});

//Add an article to the database
app.post('/articles/:uid', async (req, res) =>{
    const article = req.body;   //Get the article contents to be added to the database from the body
    const uid = req.params['uid'];    //The uid of the user who posted the article

    //If the article is added then it is fine
    //Else we send an error
    if(await addArticle(uid, article)){
        res.status(200).send('Article added successfully');
    }else{
        res.status(404).send('Unable to add article');
    }
});

//Delete a article in the database
app.delete('/articles/:uid/:title', async (req, res)=>{
    const uid = req.params['uid'];    //The uid of the user who posted the article
    const title = req.params['title'];  //Title of the article to be deletedfrom the database

    //If we deleted then it is fine 
    //Else we must return an error
    if(await deleteArticle(uid, title)){
        res.status(200).send('Deleted article successfully');
    }else{
        res.status(404).send('Unable to delete article');
    }
});

//Update the number of likes on a post
app.put('/articles/like/:name/:title', async (req, res)=>{
    const name = req.params['name'];    //Get the name of the article we want ot update the likes from
    const title = req.params['title'];  //Get the title of the article we want to add to the database

    //If the action is successful we return a response code of 200
    //Else we return an error code
    if(await addLike(name, title)){
        res.status(200).send('Updated Likes successfully');
    }else{
        res.status(404).send('Unable to update Likes');
    }
});


//Approve a pending article
app.put('/articles/approve/:name/:title', async (req, res)=>{
    const name = req.params['name'];    //Get the name of the article we want ot update the likes from
    const title = req.params['title'];  //Get the title of the article we want to add to the database

    //If the action is successful we return a response code of 200
    //Else we return an error code
    if(await approveArticle(name, title)){
        res.status(200).send('Updated Likes successfully');
    }else{
        res.status(404).send('Unable to update Likes');
    }
});




//------------------------------------- REPORTING SECTION -------------------------------------------------//
//Get all the reports in the database
app.get('/reports', async (req, res)=>{
    const response = await getAllReports();     // Gets all the reports in the database
    res.json(response);     //Return the reponse of all the Reports
});

//Add a new Report in the database
app.post('/reports/:uid', async (req, res)=>{
    const report = req.body;    //Stores the contents of the report
    const uid = req.params['uid'];      //Stores the uid of the user who reports an incident

    //If the action is successful we return a response code of 200
    //Else we return an error code
    if(await addReport(uid, report)){
        res.status(200).send('Report added successfully');
    }else{
        res.status(404).send('Unable to add report');
    }
});

//Get reports of a specific user
app.get('/users/:uid', async (req, res)=>{
    const uid = req.params['uid'];  //Gets the user id from the parameters
    const response = await getUserReport(uid);    //Calls function to get that report for the specific user
    res.json(response); //Return the response
});




//------------------------------------- ALERT SECTION -------------------------------------------------//
//Get all the alerts in the database
app.get('/alert', async (req, res)=>{
    const response = await getAllAlerts();     // Gets all the reports in the database
    res.json(response);     //Return the reponse of all the Reports
});

//Add a new alert in the database
app.post('/alert/:uid', async (req, res)=>{
    const alert = req.body;    //Stores the contents of the report
    const uid = req.params['uid'];

    //If the action is successful we return a response code of 200
    //Else we return an error code
    if(await addAlert(uid, alert)){
        res.status(200).send('Alert added successfully');
    }else{
        res.status(404).send('Unable to add alert');
    }
});

//Delete a alert in the database
app.delete('/alert/:uid', async (req, res)=>{
    const alertuid = req.params['uid'];    //The uid of the user who posted the article

    //If we deleted then it is fine 
    //Else we must return an error
    if(await deleteReport(alertuid)){
        res.status(200).send('Deleted alert successfully');
    }else{
        res.status(404).send('Unable to delete alert');
    }
});

//Update the alert status
app.put('/alert/:uid', async (req, res)=>{
    const reportID = req.params['uid'];    //Get the report ID from which to update status
    const processor = req.body;

    //If the action is successful we return a response code of 200
    //Else we return an error code
    if(await updateViewAlert(reportID, processor)){
        res.status(200).send('Updated alert successfully');
    }else{
        res.status(404).send('Unable to update alert');
    }
});



//------------------------------------- NOTIFICATIONS SECTION -------------------------------------------------//
//Get all the notifications in the database
app.get('/notifications/:uid', async (req, res)=>{
    const uid = req.params['uid'];  //get the uid that will be used to check whether or not notification has been viewed

    const response = await getAllNotifications(uid);     // Gets all the notifications in the database
    res.json(response);     //Return the reponse of all the Reports
});

//Get all the notifications in the database that are unread
app.get('/notifications/read/:uid', async (req, res)=>{
    const uid = req.params['uid'];  //get the uid that will be used to check whether or not notification has been viewed

    const response = await getAllReadNotifications(uid);     // Gets all the notifications in the database
    res.json(response);     //Return the reponse of all the Reports
});


//Get all the notifications in the database are read
app.get('/notifications/unread/:uid', async (req, res)=>{
    const uid = req.params['uid'];  //get the uid that will be used to check whether or not notification has been viewed

    const response = await getAllUnreadNotifications(uid);     // Gets all the notifications in the database
    res.json(response);     //Return the reponse of all the Reports
});


//Update the notification status
app.put('/notifications/status/:uid', async (req, res)=>{
    const uid = req.params['uid'];  //get the uid for that user
    const notificationID = req.body.notificationID

    //If the action is successful we return a response code of 200
    //Else we return an error code
    if(await updateNotificationStatus(uid, notificationID)){
        res.status(200).send('Updated Likes successfully');
    }else{
        res.status(404).send('Unable to update Likes');
    }
});







app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
});