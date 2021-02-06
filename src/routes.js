const express = require('express');
const app = express();
require('dotenv').config()
const passport = require('passport');
const User = require('./schema')//where it is user model
const bcrypt = require('bcrypt');

app.set('views', './view');
app.set('view engine', 'pug');


//taking to register page
    app.get('/register', (req, res) =>{
        res.render('registration')
    })

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

//using flash
    app.get('/loginw', (req, res) =>{
        let invalid = 'Username or password is incorrect'
        res.render(process.cwd() + '/view/index', {invalid: invalid})
    })

    //to login new users
    app.post('/login', passport.authenticate('local', {failureRedirect: '/loginw'}),(req, res) =>{
        res.redirect('/profile')
    })

//middleware to checked if user is registered
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
        // res.render(process.cwd() + '/view/profile', {username: req.user.username})
        res.render(process.cwd() + '/view/profile', {
            other: true,
            chat: false,
        })
    })

//routing to the chat page
app.get('/chat', (req, res) =>{
    res.render(process.cwd() + '/view/profile', {
        chat: true,
        other: false
    })
})

module.exports = app