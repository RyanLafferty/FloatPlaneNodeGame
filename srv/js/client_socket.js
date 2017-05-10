var socket = io.connect();
var canvas = document.getElementById("game_canvas");
var ctx2d = canvas.getContext("2d");
var width = 640;
var height = 480;

//initilize grid bounds
var gridBounds = new Array();
for(i = 0; i < 3; i++)
{
    gridBounds[i] = new Array();
    for(j = 0; j < 3; j++)
    {
        gridBounds[i][j] = new Array();
    }
}
  
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
    var x;
    var y;
    var minx;
    var miny;
    var maxx;
    var maxy;

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

    lineStartX = width / 3;
    lineStartY = height / 3;

    //store grid bounds
    for(i = 0; i < 3; i++)
    {
        //i = y
        miny = parseInt((lineStartY * i) + 1);
        maxy = parseInt((lineStartY * i) + lineStartY - 1);
        for(j = 0; j < 3; j++)
        {
            minx = parseInt((lineStartX * j) + 1);
            maxx = parseInt((lineStartX * j) + lineStartX - 1);

            gridBounds[i][j][0] = {x:minx, y:miny}; //top left
            gridBounds[i][j][1] = {x:maxx, y:miny}; //top right
            gridBounds[i][j][2] = {x:maxx, y:maxy}; //bottom right
            gridBounds[i][j][3] = {x:minx, y:maxy}; //bottom left
        }
    }

    //print grid bounds
    for(i = 0; i < 3; i++)
    {
        for(j = 0; j < 3; j++)
        {
            for(k = 0; k < 4; k++)
            {
                console.log(gridBounds[i][j][k]);
            }
        }
    }

}

function getMousePos(evt) 
{
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', function(evt) 
{
        var mousePos = getMousePos(evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message);

        for(i = 0; i < 3; i++)
        {
            for(j = 0; j < 3; j++)
            {

                if(mousePos.x >= gridBounds[i][j][0].x && mousePos.x <= gridBounds[i][j][1].x)
                {
                    if(mousePos.y >= gridBounds[i][j][0].y && mousePos.y <= gridBounds[i][j][2].y)
                    {
                        //console.log("i: " + i + " j: " + j);
                        console.log("x: " + j + " y: " + i);
                        break;
                    }
                }
            }
        }
}, false);


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