const Game = require('./game.js')
const deck = require('./deck.js')

const game = new Game(["Sbeve", "Joe Mama"], deck);

console.log(game.deck);
console.log(game.stack);

game.startGame();

game.useCard("Bang!")

console.log(game.deck);
console.log(game.stack);

