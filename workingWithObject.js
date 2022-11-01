const players = {
    "Sbeve": {name: "Joe", id: 1, table: [{name: "Mustang"}]},
    "Joe": {name: "Joe", id: 3, table: [{name: "Apaloosa", value: true}, {name: "Mustang", value: true}, {name: "Apaloosa", value: false}, {name: "Apaloosa", value: false}]},
    "Marvin": {name: "Joe", id: 2, table: [{name: "Mustang"}]},
    "Samuel": {name: "Joe", id: 2, table: [{name: "Mustang"}]},
    "Table": {name: "Joe", id: 2, table: [{name: "Mustang"}]},
}

const targetPlayerHand = [
  {
    name: 'Apalosa',
    rimColor: 'yellow',
    digit: 2,
    type: 'spades',
    isPlayable: false
  },
]

// for (let player of Object.keys(players)) {
//   // remove from table object where name ===
//   for (let j = 0; j < players[player].table.length; j++) {
//     if (players[player].table[j].name === "Apaloosa") {
//       players[player].table.splice(j, 1)[0];
//     }
//   }
// }

for (let i = 0; i < 2; i++) {
  const index = players["Joe"].table.findIndex(object => {
    return (object.name === 'Halina');
  });
  console.log(index);
}

console.log(players["Joe"].table);

// console.log(players["Joe"].table.some(card => card.name === 'Apaloosa'));
// find card in hand

// console.log(players["Joe"].table.splice(card => card.name === "Apaloosa", 2))

// console.log("hand: ", targetPlayerHand);

// console.log(Object.keys(players).includes("Sbeve"));

// for (var key of Object.keys(players)) console.log(key);

// console.log(Object.keys(players));
// console.log(players.indexOf());
// console.log(Object.keys(players).find(key => players[key].id === 1));
// console.log(Object.keys(players).find(key => key === "Joe"));

// const players = {
//     "Sbeve": {
//         hand: [
//             {
//             name: "Bang!",
//             rimColor: "yellow",
//             digit: 1,
//             type: "spades",
//             isPlayable: false
//             },
//             {
//             name: "Mancato!",
//             rimColor: "yellow",
//             digit: 2,
//             type: "spades",
//             isPlayable: false
//             }
//         ]
//     }
// }

// function setPlayable(cardName, playerName) {
//     for (var card of players[playerName].hand) {
//         if (card.name === cardName) {
//             card.isPlayable = true;
//         }
//     }
// }
// function setNotPlayable(cardName, playerName) {
//     for (var card of players[playerName].hand) {
//         if (card.name === cardName) {
//             card.isPlayable = false;
//         }
//     }
// }
// function setAllPlayable(playerName) {
//     // sets cardName in playerName hand to isPlayable = true
//     for (var card of players[playerName].hand) {
//         card.isPlayable = true;
//     }
// }
// function setAllNotPlayable(playerName) {
//         // sets cards in playerName hand to isPlayable = false
//         for (var card of players[playerName].hand) {
//             card.isPlayable = false;
//         }
//     }
// setAllPlayable("Sbeve");
// console.log(players["Sbeve"]);
// setAllNotPlayable("Sbeve");
// console.log(players["Sbeve"]);

// setPlayable("Bang!", "Sbeve");
// console.log(players["Sbeve"]);
// setNotPlayable("Bang!", "Sbeve");
// console.log(players["Sbeve"]);

// console.log(players["Sbeve"].hand.some(card => {(card.name === "Bang!" && card.isPlayable === true) ? return (true) : }))