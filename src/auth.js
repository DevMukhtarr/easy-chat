const express = require('express');
const app = express()
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const User = require('./schema');
require('dotenv').config()

//serialize user
passport.serializeUser((user, done) =>{
    done(null, user._id)
})

//deserialize user
passport.deserializeUser((id, done) =>{
    User.findOne({_id: new ObjectID(id)}, (err, doc) =>{
        done(null, doc)
    })
})

//local strategy
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

module.exports = app