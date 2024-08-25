require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const GooglesignInUser = require('modules/users.js');

app.use(cors());

app.get('/login',(req, res)=>{
    console.log('We have an API');
    GooglesignInUser();
    res.json({message: 'Exe Gents'});
});

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
});