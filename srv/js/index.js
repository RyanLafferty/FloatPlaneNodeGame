var socket;

function host()
{
    var room = document.getElementById('room-name').value

    socket = io.connect();
    if(socket == null || socket == undefined)
    {
        alert("Could not connect to server");
        return;
    }

    //TODO chang to check if room exists
    socket.emit('create', room);
    document.cookie = room;
}

function users()
{
    socket.emit('users', 'testRoom');
}
