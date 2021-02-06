// const io = require('socket.io-client');

    const socket  = io();

    socket.on('users', (data) =>{
        $('#num-users').text(data.currentUsers > 1 ?data.currentUsers + ' users' + ' are online' 
        : data.currentUsers +' user' + ' is online');
    })