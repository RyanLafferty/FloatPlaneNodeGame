var socket;

socket = io.connect();
  
function host()
{
    var room = document.getElementById('room-name').value

    if(socket == null || socket == undefined)
    {
        alert("Could not connect to server");
        return;
    }

    socket.emit('create', room);
}

function join()
{
    var room = document.getElementById('room-name').value

    if(socket == null || socket == undefined)
    {
        alert("Could not connect to server");
        return;
    }

    socket.emit('join', room);
}

function users()
{
    socket.emit('users', 'testRoom');
}

function connect()
{
    var room = document.cookie;
    alert(room);
}

socket.on('joined', function(room)
{
    //update html
    document.getElementById("home").style.visibility = "hidden";
    document.getElementById("game").style.visibility = "visible";
    document.title = room;
    document.getElementById("room_header").innerHTML = room;

    //log join
    console.log("Joined: " + room);
});

socket.on('error', function(res)
{
    //TODO: indicate errors in a cleaner way
    console.log(res);
    alert(res);
});