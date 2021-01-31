const express = require('express');
const app = express()
const bodyParser = require('body-parser');
require('dotenv').config()
const passport = require('passport');
const session = require('express-session');
const connect = require('./src/connect');
const auth = require('./src/auth');
const routes = require('./src/routes');


app.set('views', './view');
app.set('view engine', 'pug');


app.use(connect);


//the middleWare function that works on the URL
app.use(bodyParser.urlencoded({
    extended: false
}));

//middleWare that Parses Json
app.use(bodyParser.json())
 
 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    // cookie: {secure: true}
}),passport.initialize(),passport.session())

//using auth file
app.use(auth)

//using routes file
app.use(routes)


module.exports = app