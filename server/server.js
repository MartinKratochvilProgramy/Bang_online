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
  room: {
    users: [{
        username: "sbeve",
        id: "id"
    }],
    messages: [{
        username: "sbeve",
        message: "message content",
        id: uuid.v4()
    }]
}
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
    rooms[roomName].users.push(newUser);
    console.log(rooms[roomName]);

    io.to(data.currentRoom).emit("get_room", rooms[roomName]);
  });

  socket.on("disconnect", () => {
    // user disconnected by closing the browser
    for (var room in rooms) {
      for (let i = 0; i < rooms[room].length; i++) {
        if(rooms[room].users[i].id === socket.id) {
          rooms[room].users.splice(i, 1);
          io.to(room).emit("get_room", rooms[room]);
          return;
        }
      }
    }
  })

  socket.on("leave_room", data => {
    const roomName = data.currentRoom;
    rooms[roomName].users.splice(rooms[roomName].users.indexOf(data.username), 1);
    io.to(roomName).emit("get_room", rooms[roomName]);
  });

  socket.on("create_room", roomName => {
    rooms[roomName] = {
      users: [],
      messages: []
    };
    io.emit("rooms", rooms);
  })

  socket.on("send_message", data => {
    rooms[data.currentRoom].messages.push({
      username: data.username,
      message: data.message,
      id: uuid.v4()
    })
    io.to(data.currentRoom).emit("get_room", rooms[data.currentRoom]);
  })
});

server.listen(PORT, () => {
  console.log("SERVER IS RUNNING");
});
