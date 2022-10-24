const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
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
  jedna: [],
  dva: []
}

io.on("connection", (socket) => {
  socket.emit("rooms", rooms);

  socket.on("join_room", (data) => {
    socket.join(data.currentRoom);
    const roomName = data.currentRoom;
    const username = data.username;

    rooms[roomName].push(username);
    console.log("join: ", rooms[roomName]);

    io.to(data.currentRoom).emit("show_users", rooms[roomName]);
  });

  socket.on("disconnect", () => {
    console.log("disc", socket.id);
  })

  socket.on("leave_room", data => {
    const roomName = data.currentRoom;
    rooms[roomName].splice(rooms[roomName].indexOf(data.username), 1);
    io.to(roomName).emit("show_users", rooms[roomName]);
  });

  socket.on("create_room", roomName => {
    rooms[roomName] = [];
    socket.emit("rooms", rooms);
  })
});

server.listen(PORT, () => {
  console.log("SERVER IS RUNNING");
});
