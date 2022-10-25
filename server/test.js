const Game = require('./game.js')

const game = new Game(["Sbeve", "Joe Mama"]);

game.startGame();

game.draw(2);
game.endTurn();
game.draw(2);
game.endTurn();
game.useCard("0", 1)
game.useCard("0", 2)
game.useCard("0", 3)
game.useCard("0", 4)
game.endTurn();
game.useCard("1", 5)
game.useCard("1", 6)
game.useCard("1", 7)
game.useCard("1", 8)
game.endTurn();
game.draw(4);

console.log(game.players["0"].hand);
console.log(game.players["1"].hand);

console.log(game.deck);
console.log(game.stack);
