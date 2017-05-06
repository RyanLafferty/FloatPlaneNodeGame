var socket;
  
function host()
{
    socket = io.connect();
    socket.emit('create', 'testRoom');
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