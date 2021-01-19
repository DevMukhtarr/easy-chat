const express = require('express');
const app = express()
const bodyParser = require('body-parser');
require('dotenv').config()
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;


app.set('views', './view');
app.set('view engine', 'pug');

mongoose.connect(process.env.MONGO_URI,{ 
    useNewUrlParser: true, useUnifiedTopology: true 
}).catch(() =>{
    console.log('not able to connect to database')
})

//A schema for the Data i'll be receiving
const usersSchema = new Schema({
    username: String,
    email: String,
    password: String
})

const User = mongoose.model('User', usersSchema);

//the middleWare function that works on the URL
app.use(bodyParser.urlencoded({
    extended: false
}));

//middleWare that Parses Json
app.use(bodyParser.json())
 
//taking to register page
app.get('/register', (req, res) =>{
    res.render('registration')
})
 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    // cookie: {secure: true}
}),passport.initialize(),passport.session())

//serialize user with passport
passport.serializeUser((user, done) =>{
    done(null, user._id)
})

//deserilize user with passport
passport.deserializeUser((id, done) =>{
    User.findOne({_id: new ObjectID(id)}, (err, doc) =>{
        done(null, doc)
    })
})

passport.use(new LocalStrategy((username,password, done) =>{
        User.findOne({username: username}, (err, user) =>{
            if(err){
                return done(err)
            }
            if(!user){
                return done(null, false)
            }
            if(!bcrypt.compareSync(password, user.password)){
                return done(null, false)
            }
            return done(null, user)
        })
}
))

//to register new users
app.post('/register', (req,res, next) =>{
    User.findOne({email: req.body.email}, (err, user) =>{
        if(err){
            next(err)
        }else if(user){
            //this invalid is referres to when the user is registered already
            let invalid = "The email is a registered user"
            res.render(process.cwd() + '/view/registration', {invalid: invalid})
        }else{
            //this invalid is referred to when password and confirm password does not match
            let invalid = "Password and confirm password does not match"
            if(req.body.password !== req.body.confirmPassword){
                res.render(process.cwd() + '/view/registration', {invalid: invalid})
            }else{
                //hashing the password before sending to the db -->(database)<--
                const hash = bcrypt.hashSync(req.body.password, 12);

                //creating data to save in db 
                let ourUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hash
                }).save((error, data) =>{
                    if(error){
                        res.redirect('/')
                    }else{
                        console.log(data.username + ' registered succesfully')
                    }
                })

                res.render(process.cwd() + '/view/profile', {username: req.body.username})
            }
        }
    })
})

//to login new users
app.post('/login', passport.authenticate('local',{ failureRedirect: '/'}),(req, res) =>{
    res.render(process.cwd() + '/view/profile', {username: req.user.username})
})

//middleware to check if user has signed in before
let isSignedIn = (req, res, next) =>{
    // res.render(process.cwd() + '/view/login-success')
    if(req.isAuthenticated()){
        //returning the next function
        return next()
    }
    res.redirect('/')
}

//route to profile
app.get('/profile',isSignedIn, (req, res) =>{
   res.render(process.cwd() + '/view/profile', {username: req.user.username})
})




module.exports = app