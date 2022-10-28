const players = {
    "Sbeve": {name: "Joe", id: 1},
    "Joe": {name: "Joe", id: 2},
    "Marvin": {name: "Joe", id: 2},
    "Samuel": {name: "Joe", id: 2},
    "Table": {name: "Joe", id: 2},
}

const targetPlayerHand = [
  {
    name: 'Mancato!',
    rimColor: 'yellow',
    digit: 2,
    type: 'spades',
    isPlayable: false
  },
  {
    name: 'Beer',
    rimColor: 'yellow',
    digit: 3,
    type: 'spades',
    isPlayable: false
  }
]

// remove card from hand
for(var i = 0; i < targetPlayerHand.length; i++) {
    if(targetPlayerHand[i].digit === 2 && targetPlayerHand[i].type === 'spades') {
        targetPlayerHand.splice(i, 1);
        break;
    }
}

console.log("hand: ", targetPlayerHand);

// console.log(Object.keys(players));

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