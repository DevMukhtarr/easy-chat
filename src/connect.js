const express = require('express');
const app = express()
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI,{ 
    useNewUrlParser: true, useUnifiedTopology: true 
}).catch(() =>{
    console.log('not able to connect to database')
})

module.exports = app