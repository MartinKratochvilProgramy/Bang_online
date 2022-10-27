const players = {
    "Sbeve": {name: "Joe", id: 1},
    "Joe": {name: "Joe", id: 2},
    "Marvin": {name: "Joe", id: 2},
    "Samuel": {name: "Joe", id: 2},
    "Table": {name: "Joe", id: 2},
    "Robin": {name: "Joe", id: 2},
    "RObert": {name: "Joe", id: 2},
    "Herbert": {name: "Joe", id: 2},
}

const arr = Object.keys(players)

console.log(arr.concat(arr));

function getPlayersInRange(playerName, range) {
    // returns array of players closer than range to playerName
    const playerIndex = arr.indexOf(playerName) + arr.length;
    const concatArray = arr.concat(arr.concat(arr));
    let result = [];

    for (let i = 0; i < concatArray.length; i++) {
        if (Math.abs(i - playerIndex) <= range && i !== playerIndex) {
            result.push(concatArray[i]);
        }
    }
    return result;
}

console.log(getPlayersInRange("Herbert", 2));


