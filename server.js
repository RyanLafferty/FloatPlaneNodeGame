//TODO
//create room object:
    //object will store:
        //password
        //connected users
        //game object

//Error testing to ensure sockets are handled correctly
//also implement a closing handshake in order to close sockets

//Required Modules
var express = require('express'); //express must be installed 
var path = require('path');
var randomstring = require("randomstring"); //randomstring must be installed
var socketFun = require('./socket');


//create server objects
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server); //socket.io must be installed

//Games object where the currently running games will be stored
var games = {};
var room_passes = {};

//serve the static web content
app.use(express.static(path.join(__dirname, 'srv'))); 

//start server
server.listen(8081, function()
{
  console.log('Server Started: listening on port 8081');
});

//function that runs when a user connects to a socket
io.on('connection', function(socket)
{ 
    var current_room;

    //log socket connection
    console.log("a user has connected to socket:" + socket.id);
    socket.emit("socket_id", socket.id)

    //create/join room
    socket.on('create', function(room) 
    {current_room = socketFun.Create(room, io, socket);});

    //join room
    socket.on('join', function(room) 
    {current_room = socketFun.Join(room, io, socket, games);});

    //list users connected to room
    socket.on('get_user_list', function(room) 
    {socketFun.GetUserList(room, io, socket, current_room);});

    //handle player move
    socket.on('move', function(move)
    {socketFun.PlayerMove(move, current_room, io, socket, games);});
});