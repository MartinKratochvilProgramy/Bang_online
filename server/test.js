const Game = require('./game.js')
const deck = require('./deck.js')

const game = new Game(["Sbeve", "Joe"], deck);

game.startGame();
// console.log(game.getPlayerHand("Sbeve"));
// console.log(game.getPlayerHand("Joe"));
console.log("-----------");

console.log(game.getPlayerHand("Joe").length);
game.usePanico("Joe", 10, "spades")
console.log(game.getPlayerHand("Joe").length);


// // SBEVE TURN
// game.useBang("Joe") ;
// game.useMancato("Joe");
// console.log("Deck size: ", game.deck.length);
// console.log("Stack size: ", game.stack.length);
// game.endTurn();
// game.endTurn();
// game.endTurn();
// game.endTurn();
// game.endTurn();
// game.endTurn();
// console.log("Deck size: ", game.deck.length);
// console.log("Stack size: ", game.stack.length);

// // JOE TURN
// game.useBang("Sbeve");
// game.useMancato("Sbeve");

// // console.log("Stack: ", game.stack);

// game.putStackIntoDeck();
// // console.log("Deck: ", game.deck);
// game.draw(1);
// game.useBang("Sbeve");
// game.useMancato("Sbeve");

// game.getHands();


