const Game = require('./game.js')

const game = new Game(["Sbeve", "Sjoe"]);

game.startGame();

game.draw(2);
game.useCard("0", 1)
game.endTurn();
game.draw(2);
