'use strict';
const PORT = 5000;
const express = require('express');
const myApp = require('./myApp');
require('dotenv').config();
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http)


app.use(myApp)
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

//using socket.io
io.on('connection', socket =>{
      ++currentUsers;
      console.log('a user has connected');
      io.emit('users', {
        currentUsers,
        connected: true
      })

      socket.on('disconnect', () =>{
          console.log('a user has disconnected');
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