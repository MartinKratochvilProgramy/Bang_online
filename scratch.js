const players = {
    "Sbeve": {id: 1},
    "Joe": {id: 2}
}
// console.log(Object.keys(players));

// for (var key of Object.keys(players)) console.log(key);

console.log(Object.keys(players));
console.log(Object.keys(players).find(key => players[key].id === 1));
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