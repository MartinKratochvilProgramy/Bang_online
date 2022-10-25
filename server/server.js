const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
var uuid = require('uuid');
const cors = require("cors");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const PORT = 3001;
app.use(cors());

let rooms = {
  "room": []
}
let messages = {
  "room": []
}

io.on("connection", (socket) => {
  socket.emit("rooms", rooms);

  socket.on("join_room", (data) => {
    socket.join(data.currentRoom);
    const roomName = data.currentRoom;
    const newUser = {
      username: data.username,
      id: socket.id
    };
    rooms[roomName].push(newUser);

    io.to(data.currentRoom).emit("get_room", rooms[roomName]);
    io.to(data.currentRoom).emit("get_messages", messages[roomName]);
  });

  socket.on("disconnect", () => {
    // user disconnected by closing the browser
    for (var room in rooms) {
      for (let i = 0; i < rooms[room].length; i++) {
        if(rooms[room][i].id === socket.id) {
          rooms[room].splice(i, 1);
          io.to(room).emit("get_room", rooms[room]);
          return;
        }
      }
    }
  })

  socket.on("leave_room", data => {
    const roomName = data.currentRoom;
    rooms[roomName].splice(rooms[roomName].indexOf(data.username), 1);
    io.to(roomName).emit("get_room", rooms[roomName]);
  });

  socket.on("create_room", roomName => {
    rooms[roomName] = [];
    messages[roomName] = [];
    io.emit("rooms", rooms);
  })

  socket.on("send_message", data => {
    messages[data.currentRoom].push({
      username: data.username,
      message: data.message,
      id: uuid.v4()
    })
    io.to(data.currentRoom).emit("get_messages", messages[data.currentRoom]);
  })
});

server.listen(PORT, () => {
  console.log("SERVER IS RUNNING");
});
