class Game {
    constructor(numOfPlayers) {
        this.numOfPlayers = numOfPlayers;
        this.deck = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15];
        this.stack = [];
        this.players = {}
        this.playerRoundId = 0;

        // init players
        for (let i = 0; i < numOfPlayers; i++) {
            this.players[i] = {
                hand: [],
                table: [],
                role: null,
                character: {
                    startingHandSize: 4
                }
            }
        }
    }

    draw(playerId, numToDraw) {
        // put nomToDraw cards into hand of current playerRoundId
        // remove top card from deck
        if (this.deck.length <= 0) {
            console.log("DECK EMPTY!");
            return;
        }
        for (let i = 0; i < numToDraw; i++) {
            this.players[playerId].hand.push(this.deck[0]);
            this.deck.shift();
        }
    }

    useCard(playerId, cardName) {
        // remove card from playerId hand and place it to the end of stack
        if(!this.players[playerId].hand.includes(cardName)) {
            // if card not in hand, return
            console.log("not in hand");
            return;
        };
        // remove card from hand
        const cardIndex = this.players[playerId].hand.indexOf(cardName);
        this.players[playerId].hand.splice(cardIndex, 1);
        // place card on deck
        this.stack.push(cardName);
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

    putStackIntoDeck() {
        this.deck = this.stack;
        this.shuffleDeck();
        this.stack = []
    }

    startGame() {
        //this.shuffleDeck(); // TODO: uncomment
        // each player draws startingHandSize cards
        for (let i = 0; i < this.numOfPlayers; i++) {
            this.draw(i, this.players[i].character.startingHandSize);
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

module.exports = Game;