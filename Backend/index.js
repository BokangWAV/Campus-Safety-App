const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/',(req, res)=>{
    console.log('We have an API');
    res.json({message: 'Exe Gents'});
});

app.listen(port, ()=>{
    //console.log(`Server running at http://localhost:${port}/`);
});