const Game = require('./game.js')
const deck = require('./deck.js')

const game = new Game(["Sbeve", "Joe"], deck);

const choices = game.genCharacterChoices()

console.log(choices["Sbeve"].playerChoice);


// game.startGame();
// console.log(game.getPlayerHand("Sbeve"));
// console.log(game.getPlayerHand("Joe"));


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


