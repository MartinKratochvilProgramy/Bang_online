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

let rooms = [
  {roomId: "1", users: []},
  {roomId: "2", users: []}
];

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.emit("rooms", rooms);

  socket.on("join_room", (data) => {
    socket.join(data.room);

    const currentRoom = rooms.map(room => {
      if (room.roomId === data.room) {
        room.users.push(data.username);
      }
    });

    console.log(currentRoom);

    io.to(data.room).emit("show_users", rooms[0]);
  });

  // socket.on("send_message", (data) => {
  //   socket.to(data.currentRoom).emit("receive_message", data);
  // });
});

server.listen(PORT, () => {
  console.log("SERVER IS RUNNING");
});
