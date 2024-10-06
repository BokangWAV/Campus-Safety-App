require('dotenv').config();
const { processEvent } = require('./modules/events'); //New
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const app = express();
const port = process.env.PORT || 3000;

// Get all functions to operate on articles
const { getAllArticles, getPendingArticles, getApprovedArticles, addArticle, deleteArticle, addLike, approveArticle } = require('./modules/article.js');

// Get all the functions to operate on users
const {getAllUsers, getUser, addUser, updateProfile, updateProfilePicture, setRole} = require('./modules/users.js');

//Get all the functions to use for Reports
const { addReport, getAllReports, getUserReport, removeReport } = require('./modules/report.js');

//Get all the functions to use for Alerts
const { getAllAlerts, addAlert, deleteReport, updateViewAlert, managerViewAlert, getUserAlerts } = require('./modules/alert.js');

//Get all the functions to use for Notifications
const { getAllNotifications, getAllReadNotifications, getAllUnreadNotifications, updateNotificationStatus, getUnSeenNotifications } = require('./modules/notification.js');

//Get all the functions to use for FAQs
const {getAllFAQ, getUserFAQ, respondFAQ, displayFAQ, deleteFAQ,  addFAQ} = require('./modules/FAQ.js');

//Get all fuctions to use for Announcements
const { sendAnnouncement} = require('./modules/announcement.js');

//Get all functions to use for applications
const { getApplications,  addApplication,  approveApplication, getApplication} = require('./modules/applications.js');

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
// Add a new route to handle event submissions
/*
app.post('/events', async (req, res) => {
    const event = req.body;  // Event data coming from the client (API call)
    
    // Process the event (calculate risk, store in Firestore, and send notifications)
    const result = await processEvent(event);

    if (result.success) {
        res.status(200).json({ message: result.message });
    } else {
        res.status(500).json({ message: result.message });
    }
}); //New*/


//Update the profile picture of the user
app.put('/user/profilePicture/:uid', async (req, res)=>{
    
    const uid = req.params['uid'];  //Gets the uid passed from the parameter
    const profileURL = req.body.url;  //This is the URL to the profile picture

    //If the user profile is updated then all is well send response code 200
    //Else send an error
    if(await updateProfilePicture(uid, profileURL)){
        res.status(200).send('Updated Profile Picture successfully');
    }else{
        res.status(404).send('Unable to update Profile Picture');
    }
})


// Change user priviledges to manager
app.put('/user/role/:managerUid/:uid', async (req, res)=>{
    
    const managerUID = req.params['managerUid'];  //Gets the uid passed from the parameter
    const uid = req.params['uid']
    const role = req.body.role;

    //If the user profile is updated then all is well send response code 200
    //Else send an error
    if(await setRole(managerUID, uid, role)){
        res.status(200).send('Updated Profile Picture successfully');
    }else{
        res.status(404).send('Unable to update Profile Picture');
    }
})


//------------------------------------- APPLICATIONS SECTION ----------------------------------------------//
// This is to get all applications by user to be a manager
app.get('/applications', async (req, res)=>{
    const response = await getApplications();

    res.json(response);
})

// This is to get a user's application
app.get('/applications/:uid', async (req, res)=>{
    const uid = req.params['uid'];

    const reponse = await getApplication(uid);

    res.json(reponse)
})

//This is the add an application to be a manager
app.post('/applications/:uid', async (req, res)=>{
    const uid = req.params['uid'];

    if(await addApplication(uid)){
        res.status(200).send("Added successfully");
    }else{
        res.status(404).send("Unable to add application");
    }
})

// This is to approve an application
app.put('/applications/:uid', async (req, res)=>{
    const uid = req.params['uid'];
    const status = req.body.status;
    const applicationID = req.body.applicationID;
    const managerID = req.body.managerID;

    if(await approveApplication(uid, status, applicationID, managerID)){
        res.status(200).send("Application approved")
    }else{
        res.status(404).send("Unable to approve Application")
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
app.delete('/articles/:articleID', async (req, res)=>{
    const uid = req.params['articleID'];    //The uid of the user who posted the article

    //If we deleted then it is fine 
    //Else we must return an error
    if(await deleteArticle(uid)){
        res.status(200).send('Deleted article successfully');
    }else{
        res.status(404).send('Unable to delete article');
    }
});

//Update the number of likes on a post
app.put('/articles/like/:articleID', async (req, res)=>{
    const uid = req.params['articleID'];    //Get the name of the article we want ot update the likes from


    //If the action is successful we return a response code of 200
    //Else we return an error code
    if(await addLike(uid)){
        res.status(200).send('Updated Likes successfully');
    }else{
        res.status(404).send('Unable to update Likes');
    }
});


//Approve a pending article
app.put('/articles/approve/:articleID', async (req, res)=>{
    const uid = req.params['articleID'];    //Get the name of the article we want ot update the likes from

    //If the action is successful we return a response code of 200
    //Else we return an error code
    if(await approveArticle(uid)){
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
app.get('/reports/:uid', async (req, res)=>{
    const uid = req.params['uid'];  //Gets the user id from the parameters
    const response = await getUserReport(uid);    //Calls function to get that report for the specific user
    res.json(response); //Return the response
});


//Updates the reports of the users to removed from the database
app.put('/reports/:reportID', async (req, res)=>{
    const reportID = req.params['reportID'];    //Get the id of the report

    //If the action is successful we return a response code of 200
    //Else we return an error code
    if(await removeReport(reportID)){
        res.status(200).send('Updated Likes successfully');
    }else{
        res.status(404).send('Unable to update Likes');
    }
})




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

    //If the action is successful we return a response code of 200
    //Else we return an error code
    if(await updateViewAlert(reportID)){
        res.status(200).send('Updated alert successfully');
    }else{
        res.status(404).send('Unable to update alert');
    }
});



//Update the alert status
app.put('/alert/manager/:uid', async (req, res)=>{
    const reportID = req.params['uid'];    //Get the report ID from which to update status

    //If the action is successful we return a response code of 200
    //Else we return an error code
    if(await managerViewAlert(reportID)){
        res.status(200).send('Updated alert successfully');
    }else{
        res.status(404).send('Unable to update alert');
    }
})


//Get all the alerts of a user in the database
app.get('/alert/:uid', async (req, res)=>{
    const uid = req.params['uid']
    const response = await getUserAlerts(uid);     // Gets all the reports in the database
    res.json(response);     //Return the reponse of all the Reports
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

//Get the notifications that have not been read
app.get('/notifications/Unseen/:uid', async (req, res)=>{
    const uid = req.params['uid']

    const response = await getUnSeenNotifications(uid)

    res.json(response);
})




//--------------------------------------------------FAQ Section------------------------------------------------------------//
//Get all FAQs
app.get('/FAQs', async (req, res)=>{
    const response = await getAllFAQ();
    res.json(response);
})


//Get user FAQs
app.get('/FAQs/:uid', async (req, res)=>{
    const uid = req.params['uid']   //Get the uid of the user

    const response = await getUserFAQ(uid);

    res.json(response);
})


//Respond FAQs
app.put('/FAQ/:FAQID', async (req, res)=>{
    const FAQID = req.params['FAQID'];
    const answer = req.body.answer;

    if(await respondFAQ(FAQID, answer)){
        res.status(200).send("Responded Successfully")
    }else{
        res.status(404).send("Unable to respond");
    }
});


//Display FAQ
app.put('/FAQ/publish/:FAQID', async (req, res)=>{
    const FAQID = req.params['FAQID']

    if(await displayFAQ(FAQID)){
        res.status(200).send("Displayed Successfully");
    }else{
        res.status(404).send("Unable to display FAQ")
    }

})


//Remove FAQs
app.delete('/FAQ/:FAQID', async (req, res)=>{
    const FAQID = req.params['FAQID']

    if( await deleteFAQ(FAQID)){
        res.status(200).send("Deleted Successfully")
    }else(
        res.status(404).send("Unable to delete FAQ")
    )
})


//Add a FAQ
app.post('/FAQ', async (req, res)=>{
    const FAQ = req.body;

    if( await addFAQ(FAQ)){
        res.status(200).send("Added FAQ");
    }else{
        res.status(404).send("Unable to add FAQ");
    }
})



//============================================= Announcement Section =================================================//
app.post('/announcement/:uid', async (req, res)=>{
    const uid = req.params['uid']
    const announcement = req.body

    if(await sendAnnouncement(uid, announcement)){
        res.status(200).send("Announcement Sent")
    }else{
        res.status(404).send("Failed to send Announcement")
    }
    
});

//============================================= EVENT SECTION =========================================================//

cron.schedule('0 0 * * *', async () => {
    console.log("Checking event to see which to upload")
    const url = 'https://us-central1-witslivelycampus.cloudfunctions.net/app/events';

    var response;
    var success = false;
    var result = false

    await fetch(url, {
        method: 'GET',
        headers: {  
            'Content-Type': 'application/json'
        }
    }).then(async (data) =>{response = await data.json()})
    .then(()=>{
        response.forEach(async (event) => {
            const inputDate = event.date; // Input date as string
            
    
            // Get today's date
            const today = new Date();
            const todayString = today.toISOString().slice(0, 10); // Convert to 'YYYY-MM-DD' format
    
            // Compare the input date with today's date
            if (inputDate === todayString  ) {
                if(typeof(event.title) === "undefined"){
                    console.log(event);
                }else{
                    result = await processEvent(event);
                    //console.log(result)
                }
                
            } else {
                if(typeof(event.title) === "undefined"){
                    console.log(event);
                }else{
                    //console.log(event.title, event.date);
                }
                
            }
            
    
            if (await result.success) {
                success = true;
            }

        })
        
    });
});



//============================================= MAINTANENCE SECTION ===============================================//
app.get('/maintenance', async (req, res)=>{
    const url = 'https://wiman.azurewebsites.net/api/venues'; 
    const token = process.env.MAINTENACE_KEY;  

    var response;

    await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  
            'Content-Type': 'application/json'
        }
    }).then(async (data) =>{response = await data.json()})

    res.json(response);
})



app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
});
