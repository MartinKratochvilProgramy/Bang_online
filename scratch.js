class Test {
    constructor(numOfPlayers) {
        this.numOfPlayers = numOfPlayers;
        this.deck = [1, 2, 3, 4, 5, 6, 7]
        this.players = {}
        this.playerRoundId = 0;
        for (let i = 0; i < numOfPlayers; i++) {
            this.players[i] = {hand: []}
        }
    }

    draw() {
        if (this.deck.length <= 0) {
            console.log("DECK EMPTY!");
            return;
        }
        this.players[this.playerRoundId].hand.push(this.deck[0]);
        this.deck.shift();
        this.playerRoundId += 1;
        if (this.playerRoundId >= this.numOfPlayers) this.playerRoundId = 0;
    }

    helloWorld() {
        return ("hello world");
    }

    shuffleDeck() {
        let currentIndex = this.deck.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [this.deck[currentIndex], this.deck[randomIndex]] = [
            this.deck[randomIndex], this.deck[currentIndex]];
        }
      }

    getNumOfCardsInEachHand() {
        let state = {}
        for (let i = 0; i < this.numOfPlayers; i++) {
            state[i] = {handSize: this.players[i].hand.length}
        }
        return state;
    }

    getDeck() {
        return this.deck;
    }

    getPlayers() {
        return this.players;
    }
}

const obj = new Test(4);
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