//TODO
//On home page have the user log into a default room and when
    //join is pressed: check if game room is full
    //host is pressed: check if room exists and has players

//create room object:
    //object will store:
        //password
        //connected users
        //game object
//create game object:
    //game object will store:
        //game
        //game state information

//Error testing to ensure sockets are handled correctly
//also implement a closing handshake in order to close sockets

var express = require('express'); //express must be installed 
var path = require('path');
var randomstring = require("randomstring"); //randomstring must be installed

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
            //TODO return something to indicate cannot create room
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
        var user_list = [];
        var users = io.sockets.adapter.rooms[room].sockets;
        console.log("connected users\n=================");
        console.log(users);
        for(user in users)
        {
            user_list.push(user);
        }
        io.in(current_room).emit('user_list', user_list);
    });

    //TODO add logic to determine if its the current players turn
    //TODO add logic to prevent squares from being over written
    socket.on('move', function(move)
    {
        var player = -1;
        if(games[current_room] == undefined || games[current_room] == null)
        {
            //TODO return error
            return;
        }

        if(games[current_room].players[0] === socket.id)
        {
            player = 0;
        }
        else if(games[current_room].players[1] === socket.id)
        {
            player = 1;
        }

        if(player >= 0)
        {
            games[current_room].grid[move.y][move.x] = player;
            console.log(current_room + ": Current Game State: ");
            console.log(games[current_room].grid);
            io.in(current_room).emit('player_move',
            {   player:player,
                x:move.x,
                y:move.y
            });
        }
        else
        {
            //TODO report error
        }


    });
});
