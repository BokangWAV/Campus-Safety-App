const express = require('express');
const cors = require('cors');
const app = express()

app.use(cors());

app.get('/',(req, res)=>{
    res.json({message: 'Exe Gents'});
});

app.listen(8080);