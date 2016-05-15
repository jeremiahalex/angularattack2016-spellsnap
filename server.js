"use strict";

const express     = require("express");
const http        = require("http");
const app         = express();
const port        = process.env.PORT || 3000;
const server      = http.createServer(app);
const io          = require("socket.io")(server);
const connections = [];

var connectionCount = 0;

app.get('/', (req, res) => {
   res.send(`Server is working. ${connectionCount} Connections.`); 
});

//start ther server listening
server.listen(port, ()=>{
    console.log("Server listening on port: ", server.address().port);
});

//listen for a socket io connection event
io.on("connection", (socket) => {
  ++connectionCount;
  //new connection, TODO. save the socket for later
  console.log(`New connection (${socket.id})`);
  
  //listen for a disconnect event
  socket.once("disconnect", () => {
    --connectionCount;
    console.log(`Lost connection (${socket.id})`);
    socket.disconnect();
  });
  
});