const Game = require('./game.js')
const deck = require('./deck.js')

const game = new Game(["Sbeve", "Joe"], deck);

game.startGame();
game.getPlayerHand("Sbeve");
game.getPlayerHand("Joe");
console.log("-----------");

// for (var player in game.players) {
//     console.log(player, ": ", game.players[player].hand);
// }
// game.getHands();

game.useBang("Joe") ;
game.useMancato("Joe");
game.endTurn();

game.useBang("Sbeve");
game.useMancato("Sbeve");

// game.getHands();

game.putStackIntoDeck();
game.draw(4);
game.useBang("Sbeve");

// game.getHands();



console.log("Stack: ", game.stack);