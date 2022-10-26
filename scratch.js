const players = {
    "Sbeve": {id: 1},
    "Joe": {id: 2}
}
// console.log(Object.keys(players));

// for (var key of Object.keys(players)) console.log(key);

console.log(Object.keys(players));
console.log(Object.keys(players).find(key => players[key].id === 1));
// console.log(Object.keys(players).find(key => key === "Joe"));