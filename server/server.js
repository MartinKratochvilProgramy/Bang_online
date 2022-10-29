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

  // ********** GAME LOGIC **********
  socket.on("start_game", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game = new Game(data.players, deck);
    rooms[roomName].game.startGame();
    io.to(roomName).emit("game_started", rooms[roomName].game.getAllPlayersInfo());
    
    io.to(roomName).emit("current_player", rooms[roomName].game.getCurrentPlayer());
  });

  socket.on("get_my_hand", data => {
    const roomName = data.currentRoom;
    socket.emit("my_hand", rooms[roomName].game.getPlayerHand(data.username));
  })

  socket.on("play_bang", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useBang(data.target, data.cardDigit, data.cardType, data.username);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("play_bang_in_duel", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useBangInDuel(data.cardDigit, data.cardType, data.username);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("play_mancato", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useMancato(data.username, data.cardDigit, data.cardType);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("play_beer", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.useBeer(data.username, data.cardDigit, data.cardType);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("play_diligenza", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useDiligenza(data.username, data.cardDigit, data.cardType);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("play_wellsfargo", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useWellsFargo(data.username, data.cardDigit, data.cardType);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("play_duel", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useDuel(data.target, data.cardDigit, data.cardType);
    io.to(roomName).emit("duel_active", rooms[roomName].game.duelActive);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("play_cat_ballou", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useCatBallou(data.target, data.cardDigit, data.cardType);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })
  
  socket.on("play_cat_ballou_on_table_card", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.useCatBallouOnTableCard(data.activeCard, data.target, data.cardDigit, data.cardType);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("play_panico", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.usePanico(data.target, data.cardDigit, data.cardType);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("play_panico_on_table_card", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.usePanicoOnTableCard(data.activeCard, data.target, data.cardDigit, data.cardType);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })
  
  socket.on("place_horse_on_table", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.placeHorseOnTable(data.card);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })
  
  socket.on("place_gun_on_table", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.placeGunOnTable(data.card);
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("lose_health", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.loseHealth(data.username);
    io.to(roomName).emit("duel_active", rooms[roomName].game.duelActive); // TODO: this is not optimal, lose_health happens also outside duel
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("end_turn", (currentRoom) => {
    rooms[currentRoom].game.endTurn(); //end turn in game
    const currentPlayer = rooms[currentRoom].game.getCurrentPlayer(); // get current player
    io.to(currentRoom).emit("current_player", currentPlayer);
  })

  socket.on("request_players_in_range", (data) => {
    socket.emit("players_in_range", rooms[data.currentRoom].game.getPlayersInRange(data.username, data.range))
  })
});

server.listen(PORT, () => {
  console.log("listening @ ", PORT);
});
