'use strict';
const PORT = 5000;
const express = require('express');
const myApp = require('./myApp');
require('dotenv').config();
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const URI = process.env.MONGO_URI;
const store = new MongoStore({ url: URI });
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');


const onAuthorizeSuccess = (data, accept) =>{
  accept(null, true);
}

const onAuthorizeFail = (data,message,error, accept) =>{
  if(error) throw new Error(message);
  accept(null, false)
}

io.use(
  passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: 'express.id',
    secret: process.env.SESSION_SECRET,
    store: store,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
  })
)


app.use(myApp);
app.use('/fonts', express.static(process.cwd() + '/fonts'));
app.set('views', './view');
app.set('view engine', 'pug');
app.use('/scripts', express.static(process.cwd() + '/scripts'))
//accessing the default home styles
app.use('/styles', express.static(process.cwd() + '/styles'))

//routing to the home page which is login
app.get('/', (req, res) =>{
  res.render('index')
})


// number of users
let currentUsers = 0;

//using socket.io when a connection occurs at first
io.on('connection', socket =>{
      ++currentUsers;
      io.emit('users', {
        currentUsers,
        connected: true
      })
      //when a user sends message
      socket.on('message', (message) =>{
        io.emit('message', {
          name: socket.request.user.username,
          message
        })
      })
      //when a user disconnects
      socket.on('disconnect', () =>{
          --currentUsers;
          io.emit('user', {
            currentUsers,
            connected: false
          })
      })
  })


// server listen
http.listen(process.env.PORT || PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});