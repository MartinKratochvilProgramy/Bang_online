const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
var uuid = require('uuid');
const cors = require("cors");
const Game = require('./game.js');
const deck = require('./deck.js')

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const PORT = 3001;
app.use(cors());

let rooms = {
  "room": {
    players: [],
    messages: [],
    game: null
  }
}

io.on("connection", (socket) => {
  socket.emit("rooms", Object.keys(rooms));

  socket.on("join_room", (data) => {
    socket.join(data.currentRoom);
    const roomName = data.currentRoom;
    const newUser = {
      username: data.username,
      id: socket.id
    };
    rooms[roomName].players.push(newUser);

    io.to(data.currentRoom).emit("get_players", rooms[roomName].players);
    io.to(data.currentRoom).emit("get_messages", rooms[roomName].messages);
  });

  socket.on("disconnect", () => {
    // user disconnected by closing the browser
    for (var room in rooms) {
      for (let i = 0; i < rooms[room].length; i++) {
        if(rooms[room].players[i].id === socket.id) {
          rooms[room].players.splice(i, 1);
          io.to(room).emit("get_players", rooms[room].players);
          return;
        }
      }
    }
  })

  socket.on("leave_room", data => {
    const roomName = data.currentRoom;
    rooms[roomName].players.splice(rooms[roomName].players.indexOf(data.username), 1);
    io.to(roomName).emit("get_players", rooms[roomName].players);
  });

  socket.on("create_room", roomName => {
    rooms[roomName] = {
      players: [],
      messages: []
    };

    io.emit("rooms", Object.keys(rooms));
  })

  socket.on("send_message", data => {
    const roomName = data.currentRoom;
    rooms[roomName].messages.push({
      username: data.username,
      message: data.message,
      id: uuid.v4()
    })
    io.to(roomName).emit("get_messages", rooms[roomName].messages);
  })

  socket.on("start_game", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game = new Game(data.players, deck);
    rooms[roomName].game.startGame();
    io.to(roomName).emit("game_started", rooms[roomName].game.players);
  })
});

server.listen(PORT, () => {
  console.log("listening @ ", PORT);
});
