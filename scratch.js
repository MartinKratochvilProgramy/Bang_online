const players = {
    "0": {name: "Sbeve"},
    "1": {name: "Joe"}
}

console.log(Object.keys(players).find(key => players[key].name === "Joe"));