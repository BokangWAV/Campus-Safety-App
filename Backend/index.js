require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

//import { GooglesignInUser } from 'modules/users.js';

app.use(cors());

app.get('/',(req, res)=>{
    console.log('you can login');
    res.json({message: 'Exe Gents'});
});

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
});