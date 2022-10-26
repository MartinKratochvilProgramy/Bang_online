const Game = require('./game.js')
const deck = require('./deck.js')

const game = new Game(["Sbeve", "Joe"], deck);

game.startGame();
for (var player in game.players) {
    console.log(player, ": ", game.players[player].hand);
}

game.useMancato("Joe");
game.useBang("Joe") ;
game.useBang("Joe") ;
game.useMancato("Joe");

for (var player in game.players) {
    console.log(player, ": ", game.players[player].hand);
}

console.log("Stack: ", game.stack);