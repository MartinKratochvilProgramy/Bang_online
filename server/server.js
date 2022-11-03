const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
var uuid = require('uuid');
const cors = require("cors");
const Game = require('./game.js');
const deckTwoBarrelsVulcanic = require('./deck.js')

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
  socket.emit("rooms", getRoomsInfo());

  socket.on("join_room", (data) => {
    socket.join(data.currentRoom);
    const roomName = data.currentRoom;
    const newUser = {
      username: data.username,
      id: socket.id
    };
    rooms[roomName].players.push(newUser);

    io.emit("rooms", getRoomsInfo());
    
    io.to(data.currentRoom).emit("get_players", rooms[roomName].players);
    io.to(data.currentRoom).emit("get_messages", rooms[roomName].messages);
  });

  socket.on("disconnect", () => {
    // user disconnected by closing the browser
    // search rooms for player
    for (var room of Object.keys(rooms)) {
      // iterate throught players inside room
      for (let i = 0; i < rooms[room].players.length; i++) {
        // if player === player who disconnected, splice him
        if(rooms[room].players[i].id === socket.id) {
          rooms[room].players.splice(i, 1);
          io.emit("rooms", getRoomsInfo());

          // tell game a player left if room exists
          if (rooms[room].game && rooms[room].players.length >= 2) {
            // if game exists, remove player from game
            rooms[room].game.removePlayer(rooms[room].players[i].username);
            // send info to client
            updateGameState(io, room);
            nextTurn(io, room);
          }
          socket.emit("room_left");
          

          if(rooms[room].players.length <= 0) {
            // if room empty, delete it
            delete rooms[room];
          } else {
            // if players left in game, emit to them
            io.to(room).emit("get_players", rooms[room].players);
          }
          break;
        }
      }
    }
  })

  socket.on("leave_room", data => {
    const roomName = data.currentRoom;
    // leave socket
    socket.leave(roomName);
    // remove player from players
    rooms[roomName].players.splice(rooms[roomName].players.indexOf(data.username), 1);

    
    if(rooms[roomName].players.length <= 0) {
      // if room empty, delete it
      delete rooms[roomName];
      socket.emit("rooms", getRoomsInfo()); 
    } else {
      if (rooms[roomName].game !== null) {
        // if game exists
        // tell game a player left
        rooms[roomName].game.removePlayer(data.username);
        // send info to client
        updateGameState(io, roomName);
        nextTurn(io, roomName);
        // if players left in game, emit to them
        io.to(roomName).emit("get_players", rooms[roomName].players);
      }
    }
    io.emit("rooms", getRoomsInfo());
  });

  socket.on("create_room", roomName => {
    rooms[roomName] = {
      players: [],
      messages: [],
      game: null
    };

    io.emit("rooms", getRoomsInfo());
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

    rooms[roomName].game = new Game(data.players, deckTwoBarrelsVulcanic);
    rooms[roomName].game.startGame();
    
    // emit so Join Room could not be displayed
    io.emit("rooms", getRoomsInfo());
    
    let characters = []
    for (var player of Object.keys(rooms[roomName].game.players)) {
      characters.push({playerName: player, character: rooms[roomName].game.players[player].character.name})
    }
    io.to(roomName).emit("characters", characters);
    io.to(roomName).emit("current_player", rooms[roomName].game.getNameOfCurrentTurnPlayer());
    
    const currentPlayer = rooms[roomName].game.getNameOfCurrentTurnPlayer(); // get current player
  
    if (rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
      io.to(roomName).emit("update_draw_choices", "Kit Carlson");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
      io.to(roomName).emit("update_draw_choices", "Lucky Duke");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
      io.to(roomName).emit("update_draw_choices", "Jesse Jones");
  
    }

    io.to(roomName).emit("game_started", rooms[roomName].game.getAllPlayersInfo());
  });

  socket.on("get_my_hand", data => {
    const roomName = data.currentRoom;
    socket.emit("my_hand", rooms[roomName].game.getPlayerHand(data.username));
  })

  socket.on("get_my_draw_choice", data => {
    const roomName = data.currentRoom;
    socket.emit("my_draw_choice", rooms[roomName].game.drawChoice);
  })

  socket.on("play_bang", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useBang(data.target, data.cardDigit, data.cardType, data.username);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    updateGameState(io, roomName);

    if (rooms[roomName].game.players[data.target].character.name === "Jourdonnais") {
      io.to(roomName).emit("jourdonnais_can_use_barel");
    }
  })

  socket.on("play_bang_as_CJ", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useBangAsCJ(data.username, data.cardDigit, data.cardType);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    updateGameState(io, roomName);
  })

  socket.on("play_bang_in_duel", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useBangInDuel(data.cardDigit, data.cardType, data.username);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    updateGameState(io, roomName);
  })

  socket.on("play_bang_on_indiani", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useBangOnIndiani(data.cardDigit, data.cardType, data.username);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    updateGameState(io, roomName);
  })

  socket.on("play_mancato", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useMancato(data.username, data.cardDigit, data.cardType);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    updateGameState(io, roomName);
  })
  
  socket.on("play_mancato_as_CJ", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useMancatoAsCJ(data.target, data.cardDigit, data.cardType, data.username);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    updateGameState(io, roomName);
  })
  
  socket.on("play_mancato_in_duel", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useMancatoInDuel(data.cardDigit, data.cardType, data.username);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    updateGameState(io, roomName);
  })

  socket.on("play_beer", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useBeer(data.username, data.cardDigit, data.cardType);
    updateGameState(io, roomName);
  })

  socket.on("play_saloon", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useSaloon(data.username, data.cardDigit, data.cardType);
    updateGameState(io, roomName);
  })

  socket.on("play_emporio", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useEmporio(data.username, data.cardDigit, data.cardType);
    // send emporio state to clients
    io.to(roomName).emit("emporio_state", {cards: rooms[roomName].game.emporio, nextEmporioTurn: rooms[roomName].game.nextEmporioTurn});
    updateGameState(io, roomName);
  })

  socket.on("get_emporio_card", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.getEmporioCard(data.username, data.card);
    // send emporio state to clients
    io.to(roomName).emit("emporio_state", {cards: rooms[roomName].game.emporio, nextEmporioTurn: rooms[roomName].game.nextEmporioTurn});
    updateGameState(io, roomName);
  })

  socket.on("get_choice_card_KC", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.getChoiceCardKC(data.username, data.card);
    updateGameState(io, roomName);
    io.to(roomName).emit("update_draw_choices", "Kit Carlson");
    io.to(roomName).emit("update_hands");
  })

  socket.on("get_choice_card_LD", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.getChoiceCardLD(data.username, data.card);
    updateGameState(io, roomName);
    io.to(roomName).emit("update_draw_choices", "Lucky Duke");
  })

  socket.on("get_stack_card_PR", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.getStackCardPR(data.username,);
    // send emporio state to clients
    updateGameState(io, roomName);
  })

  socket.on("play_diligenza", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useDiligenza(data.username, data.cardDigit, data.cardType);
    updateGameState(io, roomName);
  })

  socket.on("play_gatling", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useGatling(data.username, data.cardDigit, data.cardType);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    updateGameState(io, roomName);

    for (const player of Object.keys(rooms[roomName].game.players)) {
      if (rooms[roomName].game.players[player].character.name === "Jourdonnais") {
        io.to(roomName).emit("jourdonnais_can_use_barel");
      }
    }

  })

  socket.on("play_indiani", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useIndiani(data.username, data.cardDigit, data.cardType);
    io.to(roomName).emit("indiani_active", rooms[roomName].game.indianiActive);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    updateGameState(io, roomName);
  })

  socket.on("play_wellsfargo", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useWellsFargo(data.username, data.cardDigit, data.cardType);
    updateGameState(io, roomName);
  })

  socket.on("play_duel", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useDuel(data.target, data.cardDigit, data.cardType);
    io.to(roomName).emit("duel_active", rooms[roomName].game.duelActive);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    updateGameState(io, roomName);
  })
  
  socket.on("play_prigione", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.playPrigione(data.target, data.activeCard);
    updateGameState(io, roomName);
  })

  socket.on("play_cat_ballou", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.useCatBallou(data.target, data.cardDigit, data.cardType);
    updateGameState(io, roomName);
  })
  
  socket.on("play_cat_ballou_on_table_card", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.useCatBallouOnTableCard(data.activeCard, data.target, data.cardDigit, data.cardType);
    updateGameState(io, roomName);
  })

  socket.on("play_panico", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.usePanico(data.target, data.cardDigit, data.cardType);
    updateGameState(io, roomName);
  })

  socket.on("play_panico_on_table_card", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.usePanicoOnTableCard(data.activeCard, data.target, data.cardDigit, data.cardType);
    updateGameState(io, roomName);
  })
  
  socket.on("place_blue_card_on_table", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.placeBlueCardOnTable(data.card);
    updateGameState(io, roomName);
  })

  socket.on("lose_health", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.loseHealth(data.username);
    io.to(roomName).emit("duel_active", rooms[roomName].game.duelActive); // TODO: this is not optimal, lose_health happens also outside duel
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
  })

  socket.on("use_barel", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.useBarel(data.username);
    updateGameState(io, roomName);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
  })
  
  socket.on("use_dynamite", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.useDynamite(data.username, data.card);
    updateGameState(io, roomName);
    if (rooms[roomName].game.players[data.username].character.health <= 0) {
      endTurn(io, roomName);
      return;
    }
    io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());

    const currentPlayer = rooms[roomName].game.getNameOfCurrentTurnPlayer();
    if (rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
      io.to(roomName).emit("update_draw_choices", "Kit Carlson");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
      io.to(roomName).emit("update_draw_choices", "Lucky Duke");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
      io.to(roomName).emit("update_draw_choices", "Jesse Jones");
    }
  })
  
  socket.on("use_prigione", (data) => {
    const roomName = data.currentRoom;
    
    rooms[roomName].game.usePrigione(data.username, data.card);
    updateGameState(io, roomName);
    io.to(roomName).emit("update_players_with_action_required", rooms[roomName].game.getPlayersWithActionRequired());

    const currentPlayer = rooms[roomName].game.getNameOfCurrentTurnPlayer();
    if (rooms[roomName].game.players[currentPlayer].character.name === "Kit Carlson") {
      io.to(roomName).emit("update_draw_choices", "Kit Carlson");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Lucky Duke") {
      io.to(roomName).emit("update_draw_choices", "Lucky Duke");
  
    } else if (rooms[roomName].game.players[currentPlayer].character.name === "Jesse Jones") {
      io.to(roomName).emit("update_draw_choices", "Jesse Jones");
    }
  })
    
  socket.on("jesse_jones_target", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.jesseJonesTarget(data.target);
    updateGameState(io, roomName);
  })
    
  socket.on("draw_from_deck", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.drawFromDeck(2, data.username);
    updateGameState(io, roomName);
  })
    
  socket.on("jourdonnais_barel", (data) => {
    const roomName = data.currentRoom;

    rooms[roomName].game.jourdonnaisBarel(data.username);
    io.to(roomName).emit("update_players_losing_health", rooms[roomName].game.getPlayersLosingHealth());
    updateGameState(io, roomName);
  })

  socket.on("discard", (data) => {
    const currentRoom = data.currentRoom;

    rooms[currentRoom].game.discard(data.card.name, data.card.digit, data.card.type, data.username);
    if (rooms[currentRoom].game.players[data.username].hand.length <= rooms[currentRoom].game.players[data.username].character.health) {
      // special case for when SK is discarding
      if (rooms[currentRoom].game.players[data.username].character.name !== "Sid Ketchum") {
        // if less of equal cards in hand -> endTurn
        socket.emit("end_discard");
        endTurn(io, currentRoom);
      } else {
        updateGameState(io, currentRoom)
      }
    } else {
      updateGameState(io, currentRoom)
    }
  })

  socket.on("end_turn", (currentRoom) => {

    endTurn(io, currentRoom);
  })

  socket.on("request_players_in_range", (data) => {
    socket.emit("players_in_range", rooms[data.currentRoom].game.getPlayersInRange(data.username, data.range))
  })
});

server.listen(PORT, () => {
  console.log("listening @ ", PORT);
});


function updateGameState(io, roomName) {
    io.to(roomName).emit("update_hands");
    io.to(roomName).emit("update_top_stack_card", rooms[roomName].game.getTopStackCard());
    io.to(roomName).emit("update_all_players_info", rooms[roomName].game.getAllPlayersInfo());
}

function endTurn(io, currentRoom) {
  rooms[currentRoom].game.endTurn();

  const currentPlayer = rooms[currentRoom].game.getNameOfCurrentTurnPlayer(); // get current player
  
  if (rooms[currentRoom].game.players[currentPlayer].character.name === "Kit Carlson") {
    io.to(currentRoom).emit("update_draw_choices", "Kit Carlson");

  } else if (rooms[currentRoom].game.players[currentPlayer].character.name === "Lucky Duke") {
    io.to(currentRoom).emit("update_draw_choices", "Lucky Duke");

  } else if (rooms[currentRoom].game.players[currentPlayer].character.name === "Pedro Ramirez") {
    io.to(currentRoom).emit("update_draw_choices", "Pedro Ramirez");
  }

  io.to(currentRoom).emit("current_player", currentPlayer);
  io.to(currentRoom).emit("update_players_with_action_required", rooms[currentRoom].game.getPlayersWithActionRequired());
  updateGameState(io, currentRoom)
}

function nextTurn(io, currentRoom) {

  const currentPlayer = rooms[currentRoom].game.getNameOfCurrentTurnPlayer(); // get current player
  
  if (rooms[currentRoom].game.players[currentPlayer].character.name === "Kit Carlson") {
    io.to(currentRoom).emit("update_draw_choices", "Kit Carlson");

  } else if (rooms[currentRoom].game.players[currentPlayer].character.name === "Lucky Duke") {
    io.to(currentRoom).emit("update_draw_choices", "Lucky Duke");

  } else if (rooms[currentRoom].game.players[currentPlayer].character.name === "Pedro Ramirez") {
    io.to(currentRoom).emit("update_draw_choices", "Pedro Ramirez");
  }

  io.to(currentRoom).emit("current_player", currentPlayer);
  io.to(currentRoom).emit("update_players_with_action_required", rooms[currentRoom].game.getPlayersWithActionRequired());
  updateGameState(io, currentRoom)
}

function getRoomsInfo() {
  // return all rooms in an array
  // [{roomName, numOfPlayers, gameActive}]
  const res = []
  for (const room of Object.keys(rooms)) {
    const roomInfo = {
      name: room,
      numOfPlayers: rooms[room].players.length,
      gameActive: rooms[room].game === null ? false : true
    }
    res.push(roomInfo);
  }
return res;
}