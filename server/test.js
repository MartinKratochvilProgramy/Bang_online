const Game = require('./game.js')
const deck = require('./deck.js')

const game = new Game(["Sbeve", "Joe"], deck);

game.startGame();
console.log(game.getPlayerHand("Sbeve"));
console.log(game.getPlayerHand("Joe"));
console.log("-----------");

// for (var player in game.players) {
//     console.log(player, ": ", game.players[player].hand);
// }

// SBEVE TURN
game.useBang("Joe") ;
game.useMancato("Joe");
game.endTurn();

// JOE TURN
game.useBang("Sbeve");
game.useMancato("Sbeve");

console.log("Stack: ", game.stack);

game.putStackIntoDeck();
game.draw(4);
console.log("JOE HAND: ", game.getPlayerHand("Joe"));
game.useBang("Sbeve");
console.log("SBEVE HAND: ", game.getPlayerHand("Sbeve"));
game.useMancato("Sbeve");

// game.getHands();


