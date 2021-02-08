    const socket  = io();
    let li = document.querySelector('.chat-box');

    //when a user connects
    socket.on('users', (data) =>{
        $('#num-users').text(data.currentUsers > 1 ? data.currentUsers + ' users' + ' are online' 
        : data.currentUsers +' user' + ' is online');
    })
    //displaying message user has sent
    socket.on('message', (data) =>{
        let messageBody = document.createElement('p');
        messageBody.innerHTML = data.name+ ': ' + data.message;
        li.appendChild(messageBody);
    })

    //when a user sends message
    $('form').submit(() =>{
        var messageToSend = $('#m').val()//message in input box
        socket.emit('message', messageToSend);
        $('#m').val('')
        return false
    })
    