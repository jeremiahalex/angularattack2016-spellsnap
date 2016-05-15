"use strict";

const ROW_COUNT     = 36;
const COLUMN_COUNT  = 18;
const GAME_TIME     = 900000; //ms ~ 15mins
const express       = require("express");
const http          = require("http");
const app           = express();
const port          = process.env.PORT || 3000;
const server        = http.createServer(app);
const io            = require("socket.io")(server);
const connections   = [];

var players         = {};
var gridCells       = [];

var interval;
var timeLeft;
var lastUpdateTime;

function resetGame() {
  console.log("resetting game");
  //create the grid - repurposed from the client side
  for ( let y = 0; y < ROW_COUNT; ++y){
      gridCells[y] = [];
      for ( let x = 0; x < COLUMN_COUNT; ++x){
          gridCells[y][x] = { x: x, y: y, starter: false, content: "" };
          //every 3 cell is a starter point
          if ( x % 3 === 1 && y % 3 === 1 ){
              gridCells[y][x].starter = true;
          }
          
          //some default cells to spell the title
          if ( x === 1 && y === 1 ) gridCells[y][x].content =  "s"
          else if ( x === 2 && y === 1 ) gridCells[y][x].content =  "p"
          else if ( x === 3 && y === 1 ) gridCells[y][x].content =  "e"
          else if ( x === 4 && y === 1 ) gridCells[y][x].content =  "l"
          else if ( x === 5 && y === 1 ) gridCells[y][x].content =  "l"
          else if ( x === 1 && y === 2 ) gridCells[y][x].content =  "n"
          else if ( x === 1 && y === 3 ) gridCells[y][x].content =  "a"
          else if ( x === 1 && y === 4 ) gridCells[y][x].content =  "p"
      }
  }
  //tell any connected players to reset
  io.sockets.emit("grid", gridCells);
  
  //set a timer to reset the game every x
  if ( interval ) clearInterval(interval);
  lastUpdateTime = new Date().getTime();
  timeLeft = GAME_TIME;
  io.sockets.emit("time", timeLeft);
  
  interval = setInterval( () => {   
      var timeNow = new Date().getTime();
      var dt = timeNow - lastUpdateTime;
      
      timeLeft -= dt;
      if ( timeLeft <= 0 ) {
          resetGame();
          return;
      }
      
      lastUpdateTime = timeNow;
  },500);
}

resetGame();

app.get('/', (req, res) => {
  
   var portString = "";
   if ( req.hostname == "localhost" ) portString += `:${port}`;
   
   res.send(`
    <h1>Spell SNAP! Server</h1>
    <p>${Object.keys(players).length} Players.</p>
    <a href="${req.protocol}://${req.hostname}${portString}/reset">RESET</a>
   `); 
});

app.get('/reset', (req, res) => {
   resetGame();
   res.redirect('/'); 
});

//start ther server listening
server.listen(port, ()=>{
    console.log("Server listening on port: ", server.address().port);
});

function filterPlayers() {
  //TODO. this could be done a lot better, too many loops and nested objects
  
  var playArrs = []
  Object.keys(players).forEach( (key) => {
    playArrs.push( players[key].stats );
  });
  //if we sort this array, then we can update the players with their rank
  playArrs.sort( (a, b) => {
    return b.score - a.score;
  });
  
  //send a rank message to each 
  playArrs.forEach( (player, index) => {
    players[player.playerId].socket.emit("rank", { rank: index } );
  });
  
  return playArrs;
}

//listen for a socket io connection event
io.on("connection", (socket) => {
  //new connection, save it
  console.log(`New connection (${socket.id})`);
  players[socket.id] = {
    socket: socket,
    stats: { currentLetter: "", score: 0, playerId: socket.id }
  }
  //send a first message with the current state of the grid
  socket.emit("grid", gridCells);
  
  //tell them the time left
  socket.emit("time", timeLeft);
  
  //tell the player their id
  socket.emit("playerId", socket.id);
  
  //send a message to all players with the new list of players - for now just the number of players
  io.sockets.emit("players", filterPlayers() );
  
  //listen for a disconnect event
  socket.once("disconnect", () => {
    console.log(`Lost connection (${socket.id})`);
    delete players[socket.id];
    socket.disconnect();
    
    //send players message again
    io.sockets.emit("players", filterPlayers() );
  });
  
  //when the user sends an update
  socket.on("stats", (pack) => {
    if ( !players[socket.id] ) return;
    
    players[socket.id].stats.currentLetter = pack.currentLetter;
    players[socket.id].stats.score = pack.score;
    
    //we immediately tell all the players but we may want to throttle this instead, so they just get a summary 
    io.sockets.emit("players", filterPlayers() );
  });
  
  socket.on("addLetter", (pack) => {
    //we're foolishly trust the client, so we just check that they player is first here
    //The bigger problem here is that two players may make adjacent moves in quick succession which would be considered invalid... to be considered.
    if ( !gridCells[pack.y][pack.x].content ) {
      //we accept the letter 
      gridCells[pack.y][pack.x].content = pack.letter;
      
      //tell the player and the others about it
      socket.emit("letterAccepted", pack );
      socket.broadcast.emit("update", pack);
    } else {
      //we reject it, they must have been too slow
      socket.emit("letterRejected", pack );
    }
  });
  
  socket.on("claimWord", (pack) => {
    //same as above
    if ( !gridCells[pack.y][pack.x].content ) {
      //we accept the claim 
      //clear all claimed cells 
      pack.cells.forEach( (cell)=> {
        gridCells[cell.y][cell.x].content = "";
      })
      
      //tell the player and the others about it
      socket.emit("claimAccepted", pack );
      socket.broadcast.emit("update", pack);
    } else {
      //we reject it, they must have been too slow
      socket.emit("claimRejected", pack );
    }
  });
  
  
});