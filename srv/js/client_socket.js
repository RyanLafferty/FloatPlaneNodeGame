var socket = io.connect();
var canvas = document.getElementById("game_canvas");
var ctx2d = canvas.getContext("2d");
var width = 640;
var height = 480;
  
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

function start_game()
{
    var lineStartX = width / 3;
    var lineStartY = height / 3;

    //draw vertical lines
    ctx2d.moveTo(lineStartX, 0);
    ctx2d.lineTo(lineStartX, height);
    ctx2d.stroke();

    lineStartX = lineStartX * 2;
    ctx2d.moveTo(lineStartX, 0);
    ctx2d.lineTo(lineStartX, height);
    ctx2d.stroke();

    //draw horizontal lines
    ctx2d.moveTo(0, lineStartY);
    ctx2d.lineTo(width, lineStartY);
    ctx2d.stroke();

    lineStartY = lineStartY * 2;
    ctx2d.moveTo(0, lineStartY);
    ctx2d.lineTo(width, lineStartY);
    ctx2d.stroke();
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

    //get user list
    socket.emit('get_user_list', room);
    start_game();
});

socket.on('user_list', function(user_list)
{
    var inner = "";
    var i = 0;
    console.log(user_list);
    for(i = 0; i < user_list.length; i++)
    {
        inner += user_list[i] + "\n";
        //console.log(inner);
    }

    document.getElementById("user_list").innerHTML = inner;
    document.getElementById("user_list").style.visibility = "visible";
});

socket.on('error_res', function(res)
{
    //TODO: indicate errors in a cleaner way
    console.log(res);
    alert(res);
});