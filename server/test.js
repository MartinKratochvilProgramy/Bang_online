const Game = require('./game.js')

const game = new Game(1);

console.log(game.getDeck());
game.startGame();

console.log(game.getPlayers());

game.useCard("0", 1);