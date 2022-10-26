class Game {
    constructor(playerNames, deck) {
        this.numOfPlayers = playerNames.length;
        this.deck = deck;
        this.stack = [];
        this.players = {}
        this.playerRoundId = 0;
        this.actionExpected = null;

        // init players
        for (let i = 0; i < this.numOfPlayers; i++) {
            this.players[playerNames[i]] = {
                id: i,
                hand: [],
                table: [],
                role: null,
                character: {
                    startingHandSize: 2
                }
            }
        }
    }

    draw(numToDraw, playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)) {
        // put nomToDraw cards into hand of current playerRoundId
        // remove top card from deck


        if (this.deck.length <= 0) {
            console.log("DECK EMPTY!");
            this.putStackIntoDeck();
        }
        for (let i = 0; i < numToDraw; i++) {
            this.players[playerName].hand.push(this.deck[0]);
            this.deck.shift();
        }
        if (numToDraw === 1) {
            console.log(`Player ${playerName} drew ${numToDraw} card`);
        } else {
            console.log(`Player ${playerName} drew ${numToDraw} cards`);
        }
    }

    useCard(cardName, playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId), target=null) {
        // remove card from playerId hand and place it to the end of stack
        const playerId = this.players[playerName].id;

        // not your turn and no actionsExpected
        if (playerId !== this.playerRoundId && this.actionExpected == null) {
            console.log("Not your turn!")
            return;
        }
        
        // check if you can play
        if (this.actionExpected) {
            // correct player?
            if (this.actionExpected.player !== playerName) {
                console.log("Not your turn!");
                return;
            }
            // correct card?
            if (this.actionExpected.cardName !== cardName) {
                console.log("Not the right card!");
                return;
            }
        }

        // if card not in hand, return
        if(!this.players[playerName].hand.some(card => card.name === cardName)) {
            console.log(`Card ${cardName} not in hand!`);
            return;
        };
        // remove card from hand
        const cardIndex = this.players[playerName].hand.findIndex(card => card.name === cardName);
        const card = this.players[playerName].hand.splice(cardIndex, 1)[0];
        // place card on deck
        this.stack.push(card);

        console.log(`Player ${playerName} used ${cardName}`, target ? `on ${target}` : "");
    }

    useBang(target, playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)) {
        this.useCard("Bang!", playerName, target);

        this.actionExpected = {
            player: target,
            cardName: "Mancato!"
        }
    }

    useMancato(playerName) {
        // const playerId = this.players[playerName].id;
        this.useCard("Mancato!", playerName);

        this.actionExpected = null;
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

        console.log("Deck shuffled");
    }

    putStackIntoDeck() {
        this.deck = this.stack;
        this.stack = []
     
        console.log("Stack shuffled into deck");
     
        this.shuffleDeck();
    }

    startGame() {
        // each player draws startingHandSize cards
        //this.shuffleDeck(); // TODO: uncomment
        for (var player of Object.keys(this.players)) {
            this.draw(this.players[player].character.startingHandSize, player);
        }

        // for (let i = 0; i < this.numOfPlayers; i++) {
        //     this.draw(this.players[i].character.startingHandSize, i);
        // }

        console.log("Game started!");
    }

    endTurn() {
        // move playerRoundId forward
        this.playerRoundId += 1;
        if (this.playerRoundId >= this.numOfPlayers) {
            this.playerRoundId = 0;
        }

        console.log("End of turn");
    }

    getNumOfCardsInEachHand() {
        let state = {}
        for (let i = 0; i < this.numOfPlayers; i++) {
            state[i] = {handSize: this.players[i].hand.length}
        }
        return state;
    }

    getPlayerHand(playerName) {
        console.log(this.players[playerName].hand);
    }

    getHands() {
        for (var player of Object.keys(this.players)) {
            console.log(player, ": ", this.players[player].hand);
        }
    }

    getPlayerTurn() {
        console.log("Player turn : ", this.players[this.playerRoundId].name)
    }

    getDeck() {
        return this.deck;
    }

    getPlayers() {
        return this.players;
    }
}

module.exports = Game;