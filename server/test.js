const Game = require('./game.js')
const deck = require('./deck.js')

const game = new Game(["Sbeve", "Joe", "Kevin", "Post Malone"], deck);

game.initRoles();

console.log(game.knownRoles);
console.log(game.knownRoles["Post Malone"]);
console.log(game.knownRoles["Sbeve"]);




