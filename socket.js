module.exports = 
{
    //TODO: add logic to determine a draw
    /*
    Desc: The player move function is called when the player requests to make
    a move, this function will update the game state if the player is making a 
    valid move in a room that exists.
    Args:
        move(Object): The move object which contains the x and y (int) coordinates
        where the move is to be made.
        current_room(String): The room in which the player resides.
        io(Object): The socket.io object which is to be used to emit messages
        to sockets within the room.
        socket(Object): The connected socket object which is used to emit messages back
        to the socket.
        games(Object): The games object which contains the game state information
        of all currently in progress games (this object will be updated if the move
        is valid).
    Ret: Nothing
    */
    PlayerMove: function (move, current_room, io, socket, games)
    {
        var player = -1;
        if(games[current_room] == undefined || games[current_room] == null)
        {
            console.log("Error[Room Does Not Exist]: Broadcasting error message now");
            socket.emit('error_res', 'Error[Room Does Not Exist]: Could not make move');
            return;
        }

        if(move == undefined || move == null || move.x < 0 || move.y < 0 ||
           move.x > 2 || move.y > 2)
        {
            console.log("Error[Invalid Move]: Broadcasting error message now");
            socket.emit('error_res', 'Error[Invalid Move]: Could not make move');
            return;
        }

        //Check which player made the move
        if(games[current_room].players[0] === socket.id)
        {
            player = 0;
        }
        else if(games[current_room].players[1] === socket.id)
        {
            player = 1;
        }

        //Determine if player is in room
        if(player >= 0)
        {
            //Determine if the move can be made
            if(games[current_room].grid[move.y][move.x] === -1 && games[current_room].current_move === player)
            {
                games[current_room].grid[move.y][move.x] = player;
                if(player === 0)
                {
                    games[current_room].current_move = 1;
                }
                else
                {
                    games[current_room].current_move = 0;
                }
                //Log current game state
                console.log(current_room + ": Current Game State: ");
                console.log(games[current_room].grid);
                io.in(current_room).emit('player_move',
                {   player:player,
                    x:move.x,
                    y:move.y
                });

                //check for winner
                //check horizontal match
                for(i = 0; i < 3; i++)
                {
                    match = true;
                    for(j = 0; j < 2; j++)
                    {
                        if(games[current_room].grid[i][j] < 0 
                           || games[current_room].grid[i][j] != games[current_room].grid[i][j+1])
                        {
                            match = false;
                            break;
                        }
                    }
                    if(match === true)
                    {
                        console.log("winner: " + games[current_room].grid[i][j]);
                        io.in(current_room).emit('player_winner', games[current_room].grid[i][j]);
                        return;
                    }
                }
                //check vertical match
                for(i = 0; i < 3; i++)
                {
                    match = true;
                    for(j = 0; j < 2; j++)
                    {
                        if(games[current_room].grid[j][i] < 0 
                           || games[current_room].grid[j][i] != games[current_room].grid[j+1][i])
                        {
                            match = false;
                            break;
                        }
                    }
                    if(match === true)
                    {
                        console.log("winner: " + games[current_room].grid[j][i]);
                        io.in(current_room).emit('player_winner', games[current_room].grid[j][i]);
                        return;
                    }
                }
                //check diagonal matches
                if(games[current_room].grid[1][1] >= 0 &&
                   games[current_room].grid[0][0] === games[current_room].grid[1][1] &&
                   games[current_room].grid[1][1] === games[current_room].grid[2][2])
                {
                    console.log("winner: " + games[current_room].grid[1][1]);
                    io.in(current_room).emit('player_winner', games[current_room].grid[1][1]);
                    return;
                }
                else if(games[current_room].grid[1][1] >= 0 &&
                        games[current_room].grid[2][0] === games[current_room].grid[1][1] &&
                        games[current_room].grid[1][1] === games[current_room].grid[0][2])
                {
                    console.log("winner: " + games[current_room].grid[1][1]);
                    io.in(current_room).emit('player_winner', games[current_room].grid[1][1]);
                    return;
                }

                //check for draw
                draw = true;
                for(i = 0; i < 3; i++)
                {
                    for(j = 0; j < 3; j++)
                    {
                        if(games[current_room].grid[j][i] < 0)
                        {
                            draw = false;
                            break;
                        }
                    }
                }
                if(draw === true)
                {
                    console.log("Draw");
                    io.in(current_room).emit('player_draw', 'Draw');
                    return;
                }
            }
            else
            {
                console.log("Error[Invalid Room]: Broadcasting error message now");
                socket.emit('error_res', 'Error[Invalid Room]: Could not make move');
                return;
            }
        }
        else
        {
            console.log("Error[Player Not In Room]: Broadcasting error message now");
            socket.emit('error_res', 'Error[Player Not In Room]: Could not make move');
            return;
        }
    },


    /*
    Desc: The following function is called when a user socket requests 
    the connected users from a given room, this function will return the
    user list of a given room.
    Args:
        room(String): The room which the player would list the users from.
        move(Object): The move object which contains the x and y (int) coordinates
        where the move is to be made.
        current_room(String): The room in which the player resides.
        io(Object): The socket.io object which is to be used to emit messages
        to sockets within the room.
        socket(Object): The connected socket object which is used to emit messages back
        to the socket.
    Ret: Nothing
    */
    GetUserList: function(room, io, socket, current_room) 
    {
        if(room == undefined || room == null)
        {
            console.log("Error[Room Does Not Exist]: Broadcasting error message now");
            socket.emit('error_res', 'Error[Room Does Not Exist]: Could not return room list');
            return;
        }
        var user_list = [];
        var users = io.sockets.adapter.rooms[room].sockets;
        console.log("connected users\n=================");
        console.log(users);
        for(user in users)
        {
            user_list.push(user);
        }
        io.in(current_room).emit('user_list', user_list);
    }, 

    /*
    Desc: This function is called when a socket requests to join a room,
    the following function will attempt to join a player to a room.
    Args:
        room(String): The room which the player would like to join.
        io(Object): The socket.io object which is to be used to emit messages
        to sockets within the room.
        socket(Object): The connected socket object which is used to emit messages back
        to the socket.
        games(Object): The games object which contains the game state information
        of all currently in progress games (this object will be updated if the move
        player is allowed to join).
    Ret: On success returns room, on failure return undefined.
    */
    Join: function(room, io, socket, games) 
    {
        var join = true;
        if(room == null || room == undefined || room == '')
        {
            console.log("Error[Room Does Not Exist]: Broadcasting error message now");
            socket.emit('error_res', 'Error[Room Does Not Exist]: Could not join requested room');
            return undefined;
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
                    return room;
                }
                else
                {
                    console.log("Error[Room Full]: Broadcasting error message now");
                    socket.emit('error_res', 'Error[Room Full]: Could not join requested room');
                    return undefined;
                }
            }
        }
        else
        {
            console.log("Error[Room Does Not Exist]: Broadcasting error message now");
            socket.emit('error_res', 'Error[Room Does Not Exist]: Could not join requested room');
            return undefined;
        }
    },

    /*
    Desc: This function is called when a connected socket requests to create
    a room, if the requested room is free the following function will attempt
    to join the given socket to the room.
    Args:
        room(String): The room in which the player would like to create.
        io(Object): The socket.io object which is to be used to emit messages
        to sockets within the room.
        socket(Object): The connected socket object which is used to emit messages back
        to the socket.
    Ret: Nothing
    */
    Create: function(room, io, socket) 
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
            socket.emit('joined', room);
            return room;
        }
        else
        {
            console.log("Broadcasting error message now");
            socket.emit('error_res', 'failed to create room');
        }
    }

};