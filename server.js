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

var express = require('express'); //express must be installed 
var path = require('path');
var randomstring = require("randomstring"); //randomstring must be installed

//create server objects
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//serve the static web content
app.use(express.static(path.join(__dirname, 'srv'))); 

//register route - this will be the entry point for our
//single page app
//app.get('/rooms/:RID', function(req, res){
//    console.log("asdasd");
    //res.sendFile(__dirname + '/srv/home.html');
//});


//start server
server.listen(8081, function()
{
  console.log('listening on port 8081');
});


//function that runs when a user connects to a socket
io.on('connection', function(socket)
{ 
    console.log("a user has connected to socket:" + socket.id);

    //create/join room
    socket.on('create', function(room) 
    {
        if(room == null || room == undefined || room == '')
        {
            room = randomstring.generate(16);
        }
        //console.log('connected ' + socket.id + ' to ' + room);
        //socket.join(room);
        var users = io.sockets.adapter.rooms[room].sockets;
        console.log(users.length);
    });
    //list users connected to room
    socket.on('users', function(room) 
    {
        var users = io.sockets.adapter.rooms[room].sockets;
        console.log("connected users\n=================");
        console.log(users.length);
        console.log(users);
    });
});


//server.listen(8081);
