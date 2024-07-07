const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');


const app = express();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}); 

app.use(bodyParser.json());

app.use('/auth', authRoutes);


mongoose.connect(
    'MONGODB URL',
    {
        dbName: 'CodeForum_DB'
    }
)
.then(result => {
    console.log('DataBase Connected');
    const server = app.listen(8080);
})
.catch(err => console.log(err));



