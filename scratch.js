let rooms = {
  "room": {
    players: ["Sbeve", "Joe"],
    messages: [],
    game: null
  },
  "test": {
    players: ["Joe"],
    messages: [],
    game: null
  },
}

function getRoomInfo() {
  // return all rooms in an array
  // [{roomName, numOfPlayers, gameActive}]
  const res = []
  for (const room of Object.keys(rooms)) {
    const roomInfo = {
      roomName: room,
      numOfPlayers: rooms[room].players.length,
      gameActive: rooms[room].game === null ? false : true
    }
    res.push(roomInfo);
  }
return res;
}

console.log(getRoomInfo());