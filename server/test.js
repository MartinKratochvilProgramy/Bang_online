const Game = require('./game.js')

const obj = new Game(4);
obj.shuffleDeck();

console.log(obj.getDeck());
console.log(obj.getPlayers());

obj.draw();
obj.draw();
obj.draw();
obj.draw();
obj.draw();
obj.draw();
obj.draw();
obj.draw();
console.log(obj.getDeck());
console.log(obj.getPlayers());

const hands = obj.getNumOfCardsInEachHand()
for(var key in hands) {
    console.log(hands[key].handSize);
}