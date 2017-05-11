module.exports = 
{
    //TODO: add logic to determine a draw
    PlayerMove: function (move, current_room, io, socket, games)
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
                    }
                }
                //check diagonal matches
                if(games[current_room].grid[1][1] >= 0 &&
                   games[current_room].grid[0][0] === games[current_room].grid[1][1] &&
                   games[current_room].grid[1][1] === games[current_room].grid[2][2])
                {
                    console.log("winner: " + games[current_room].grid[1][1]);
                    io.in(current_room).emit('player_winner', games[current_room].grid[1][1]);
                }
                else if(games[current_room].grid[1][1] >= 0 &&
                        games[current_room].grid[2][0] === games[current_room].grid[1][1] &&
                        games[current_room].grid[1][1] === games[current_room].grid[0][2])
                {
                    console.log("winner: " + games[current_room].grid[1][1]);
                    io.in(current_room).emit('player_winner', games[current_room].grid[1][1]);
                }
            }
            else
            {
                //TODO error
            }
        }
        else
        {
            //TODO report error
        }
    }
};