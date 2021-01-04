'use strict';
// const http = require('http')
const PORT = 5000;
const express = require('express');
const app = express();
const myApp = require('./myApp');
require('dotenv').config();


app.use(express.static(__dirname))
app.use(myApp)
app.get('/', (req, res) =>{
  res.sendFile(__dirname + '/view/index.html')
})
app.listen(process.env.PORT || PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});