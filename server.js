//TODO
//create room object:
    //object will store:
        //password
        //connected users
        //game object

//Error testing to ensure sockets are handled correctly
//also implement a closing handshake in order to close sockets

var express = require('express'); //express must be installed 
var path = require('path');
var randomstring = require("randomstring"); //randomstring must be installed
var socketFun = require('./socket');


//create server objects
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var games = {};

//serve the static web content
app.use(express.static(path.join(__dirname, 'srv'))); 

//start server
server.listen(8081, function()
{
  console.log('listening on port 8081');
});


//function that runs when a user connects to a socket
io.on('connection', function(socket)
{ 
    var current_room;
    console.log("a user has connected to socket:" + socket.id);
    socket.emit("socket_id", socket.id)

    //create/join room
    socket.on('create', function(room) 
    {
        var create = true;
        if(room == null || room == undefined || room == '')
        {
            room = randomstring.generate(16);
        }

        //check if room has been created already or if there is already
        //a user in the room
        if(io.sockets.adapter.rooms[room] != undefined)
        {
            var users = io.sockets.adapter.rooms[room].sockets;
            if(users != undefined)
            {
                var size = 0;
                for(user in users)
                {
                    size++;
                }
                if(size >= 1)
                {
                    console.log("Error: could not create room\nconnected users\n=================");
                    console.log("size = " + size);
                    console.log(users);
                    create = false;
                }
            }
        }

        //if the room is available, then join the user to the room
        if(create == true)
        {
            socket.join(room);
            console.log('connected ' + socket.id + ' to ' + room);
            current_room = room;
            socket.emit('joined', room);
        }
        else
        {
            console.log("Broadcasting error message now");
            socket.emit('error_res', 'failed to create room');
        }
    });

    //join room
    socket.on('join', function(room) 
    {
        var join = true;
        if(room == null || room == undefined || room == '')
        {
            //TODO return failure
        }

        //check if the roome exists and join them to the room
        if(io.sockets.adapter.rooms[room] != undefined)
        {
            var users = io.sockets.adapter.rooms[room].sockets;
            var player;
            if(users != undefined)
            {
                var size = 0;
                for(user in users)
                {
                    player = user;
                    size++;
                }
                if(size == 1)
                {
                    socket.join(room);
                    console.log('connected ' + socket.id + ' to ' + room);
                    current_room = room;

                    //create room
                    var grid = new Array();
                    for(i = 0; i < 3; i++)
                    {
                        grid[i] = new Array();
                        for(j = 0; j < 3; j++)
                        {
                            grid[i][j] = -1;
                        }
                    }
                    var game = {
                        room: room,
                        players:[user, socket.id],
                        game:'Tic-Tac-Toe',
                        current_move:0,
                        grid:grid };
                    games[room] = game;
                    console.log("current game list\n============");
                    for(g in games)
                    {
                        console.log(game);
                    }

                    socket.emit('joined', room);
                }
                else
                {
                    console.log("Connected Users = " + size);

                    //TODO return failure
                }
            }
        }
        else
        {
            //TODO return failure
        }
    });

    //list users connected to room
    socket.on('get_user_list', function(room) 
    {
        socketFun.GetUserList(room, io, current_room);
    });

    socket.on('move', function(move)
    {socketFun.PlayerMove(move, current_room, io, socket, games);});
});

