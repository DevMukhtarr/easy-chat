'use strict';
// const http = require('http')
const PORT = 5000;
const express = require('express');
const myApp = require('./myApp');
require('dotenv').config();
const app = express();

app.use(myApp)
app.set('views', './view')
app.set('view engine', 'pug')
//accessing the defaalt home styles
app.use('/styles', express.static(process.cwd() + '/styles'))

//routing to the home page which is login
app.get('/', (req, res) =>{
  res.render('index')
})

//server listen
app.listen(process.env.PORT || PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});