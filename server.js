var express = require('express'); //express must be installed 

//create server objects
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


//register route - this will be the entry point for our
//single page app
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


//start server
server.listen(8081, function()
{
  console.log('listening on port 8081');
});


//function that runs when a user connects to a socket
io.on('connection', function(socket)
{ 
    console.log("a user has connected to socket:" + socket.id);
});


//server.listen(8081);