const express = require('express');
const app = express()
const bodyParser = require('body-parser');
require('dotenv').config()
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//A schema for the Data i'll be receiving
const usersSchema = new Schema({
    nickname: String,
    email: String,
    password: String,
    confirmPassword: String 
})

const User = mongoose.model('User', usersSchema);

//the middleWare function that works on the URL
app.use(bodyParser.urlencoded({
    extended: false
}));

//middleWare that Parses Json
app.use(bodyParser.json())

app.get('/registration', (req, res) =>{
    res.sendFile(__dirname + '/view/registration.html');
    // console.log(process.env.MONGO_URI)
})    

app.get('/login', (req, res) =>{
    res.sendFile(__dirname + '/view/index.html')
})    

app.post('/login', (req, res) =>{
    let username = req.body.nickname;
    let password = req.body.password;
    res.json({username: username, password: password})
})

app.post('/register', (req, res) =>{
    let username = req.body.nickname;
    let email = req.body.email;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    //model to be sent to db
    let userReg = new User({
        nickname: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    })

    userReg.save(
        (error, data) =>{
        if(error){
            console.log(error)
        }else{
            return data
        }
    }
    )
    // let directHome = () =>{
        // return res.sendFile(__dirname + '/view/index.html')
            res.sendFile(__dirname + '/view/index.html')
    // }
    // setTimeout(directHome(), 2000);
})




module.exports = app