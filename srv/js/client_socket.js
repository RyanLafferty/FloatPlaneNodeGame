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

    socket.emit('create', room);
}

function join()
{
    socket = io.connect();
    //todo join room
}

function users()
{
    socket.emit('users', 'testRoom');
}