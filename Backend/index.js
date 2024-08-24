const express = require('express');
const cors = require('cors');
const app = express();
const port = 80;

app.use(cors());

app.get('/',(req, res)=>{
    res.json({message: 'Exe Gents'});
});

app.listen(port, ()=>{
    //console.log(`Server running at http://localhost:${port}/`);
});