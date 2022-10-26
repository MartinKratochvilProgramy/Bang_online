const Game = require('./game.js')
const deck = require('./deck.js')

const game = new Game(["Sbeve", "Joe"], deck);

game.startGame();

for (var player in game.players) {
    console.log(player, ": ", game.players[player].hand);
}

game.useBang("Joe") ;
game.useMancato("Joe");
game.endTurn();

game.useBang("Sbeve");
game.useMancato("Sbeve");
for (var player in game.players) {
    console.log(player, ": ", game.players[player].hand);
}
game.putStackIntoDeck();
game.draw(1);
game.useBang("Sbeve");

for (var player in game.players) {
    console.log(player, ": ", game.players[player].hand);
}

console.log("Stack: ", game.stack);