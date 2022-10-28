class Game {
    constructor(playerNames, deck) {
        this.numOfPlayers = playerNames.length;
        this.deck = deck;
        this.stack = [];
        this.players = {}
        this.playerRoundId = 0;
        this.bangCanBeUsed = true;
        this.duelActive = false;
        this.playerPlaceHolder = null;

        // init players
        for (let i = 0; i < this.numOfPlayers; i++) {
            this.players[playerNames[i]] = {
                id: i,
                hand: [],
                table: [
                    {
                        name: "Apaloosa",
                        rimColor: "blue",
                        digit: 69,
                        type: "horse",
                        actionReqOnStart: false,
                    },
                    {
                        name: "Apaloosa",
                        rimColor: "blue",
                        digit: 69,
                        type: "horse",
                        actionReqOnStart: false,
                    },
                ],
                isLosingHealth: false,
                character: new function () {
                    return(
                        this.role = null,
                        this.maxHealth = 3 + (this.role === "Sheriffo" ? 1 : 0),
                        this.health = this.maxHealth,
                        this.startingHandSize = this.maxHealth
                    )
                }
            }
        }
    }

    draw(numToDraw, playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)) {
        // put nomToDraw cards into hand of current playerRoundId
        // remove top card from deck
        
        const currentTurnPlayerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId);
        let playerTurn = false;
        if (currentTurnPlayerName === playerName) playerTurn = true;

        if (this.deck.length <= 0) {
            console.log("DECK EMPTY!");
            this.putStackIntoDeck();
        }
        for (let i = 0; i < numToDraw; i++) {
            // if no cards in deck, put stack into deck
            if (this.deck.length === 0) this.putStackIntoDeck();

            const card = this.deck[0];
            if (playerTurn && card.name !== "Mancato!") card.isPlayable = true;
            this.players[playerName].hand.push(card);
            this.deck.shift();
        }


        if (numToDraw === 1) {
            console.log(`Player ${playerName} drew ${numToDraw} card`);
        } else {
            console.log(`Player ${playerName} drew ${numToDraw} cards`);
        }
    }

    discard(cardName, cardDigit, cardType, playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId), target=null) {
        // remove card from playerId hand and place it to the end of stack
        const playerId = this.players[playerName].id;

        // find if card in player hand and isPlayable = true
        // let foundCard = false;
        // for (var card of this.players[playerName].hand) {
        //     if (card.name === cardName && card.isPlayable) {
        //         foundCard = true;
        //         break;
        //     }
        // }
        // if (!foundCard) {
        //     console.log(`Card ${cardName} not in hand!`);
        //     return;
        // }

        // remove card from hand
        const cardIndex = this.players[playerName].hand.findIndex(card => (card.name === cardName && card.digit === cardDigit && card.type === cardType));
        const cardToDiscard = this.players[playerName].hand.splice(cardIndex, 1)[0];
        cardToDiscard.isPlayable = false;
        // place card on deck
        this.stack.push(cardToDiscard);

    }

    useBang(target, cardDigit, cardType, playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)) {
        this.discard("Bang!", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Bang! on ${target}`);

        if (!this.duelActive) {
            this.setPlayable("Mancato!", target);
        }
        if (this.duelActive) {
            this.setIsLosingHealth(false, playerName);
            this.setPlayable("Bang!", target);
        }

        this.setAllNotPlayable(playerName);
        if (!this.players[playerName].table.filter(item => item.name === 'Volcanic').length > 0 && !this.duelActive) {
            // if player has Volcanic, don't block Bang!s
            // don't resolve on duelActive
            // TODO: implement this for Billy the Kid
            this.bangCanBeUsed = false;
        }

        this.playerPlaceHolder = playerName;    // save the name of player who used Bang!, so that his hand could be enabled after target player reaction
        
        this.setIsLosingHealth(true, target);
    }

    useMancato(playerName, cardDigit, cardType) {
        this.discard("Mancato!", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Mancato!`);

        this.setNotPlayable("Mancato!", playerName);
        this.setAllPlayable(this.playerPlaceHolder);
        this.setNotPlayable("Mancato!", this.playerPlaceHolder);
        if (!this.bangCanBeUsed) {
            this.setNotPlayable("Bang!", this.playerPlaceHolder);
        }

        this.setIsLosingHealth(false, playerName);
    }

    useCatBallou(target, cardDigit, cardType, playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)) {
        // TODO: this only works on cards in hand, not table
        this.discard("Cat Ballou", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Cat Ballou`);

        // get random card from target hand
        const randomCard = this.getPlayerHand(target)[Math.floor(Math.random()*this.getPlayerHand(target).length)]

        this.discard(randomCard.name, randomCard.digit, randomCard.type, target);
        console.log(`Player ${target} discarded ${randomCard.name}`);
    }

    usePanico(target, cardDigit, cardType, playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)) {
        // TODO: this only works on cards in hand, not table
        this.discard("Panico", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Panico`);

        // get random card from target hand
        const randomCard = this.getPlayerHand(target)[Math.floor(Math.random()*this.getPlayerHand(target).length)]
        
        const currentPlayerHand = this.players[playerName].hand;
        const targetPlayerHand = this.players[target].hand;
        // remove card from hand
        for(var i = 0; i < targetPlayerHand.length; i++) {
            if(targetPlayerHand[i].digit === randomCard.digit && targetPlayerHand[i].type === randomCard.type) {
                targetPlayerHand.splice(i, 1);
                break;
            }
        }
        currentPlayerHand.push(randomCard);
    }

    useBeer(playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId), cardDigit, cardType) {
        this.discard("Beer", cardDigit, cardType);
        console.log(`Player ${playerName} used Beer`);

        this.players[playerName].character.health += 1;
    }

    useDiligenza(playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId), cardDigit, cardType) {
        this.discard("Diligenza", cardDigit, cardType);
        console.log(`Player ${playerName} used Diligenza`);

        this.draw(2, playerName);
    }

    useWellsFargo(playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId), cardDigit, cardType) {
        this.discard("Wells Fargo", cardDigit, cardType);
        console.log(`Player ${playerName} used Wells Fargo`);

        this.draw(3, playerName);
    }

    useDuel(target, cardDigit, cardType, playerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)) {
        this.discard("Duel", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Duel on ${target}`);

        this.setPlayable("Bang!", target);
        this.setIsLosingHealth(true, target);
        
        this.setAllNotPlayable(playerName);

        this.duelActive = true;
        this.playerPlaceHolder = playerName;    // save the name of player who used Bang!, so that his hand could be enabled after target player reaction
        
    }

    placeBlueCardOnTable() {
        
    }

    loseHealth(playerName) {
        this.players[playerName].character.health -= 1;
        this.setIsLosingHealth(false, playerName);
        this.setNotPlayable("Mancato!", playerName);
        if (!this.bangCanBeUsed) {
            this.setNotPlayable("Bang!", this.playerPlaceHolder);
        }
        if (this.duelActive) {
            this.duelActive = false;
            if (this.bangCanBeUsed) {
                const currentPlayer = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId);
                this.setNotPlayable("Bang!", playerName);
                this.setPlayable("Bang!", currentPlayer);
            }
        }
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

    setPlayable(cardName, playerName) {
        // sets cardName in playerName hand to isPlayable = true
        for (var card of this.players[playerName].hand) {
            if (card.name === cardName) {
                card.isPlayable = true;
            }
        }
    }

    setNotPlayable(cardName, playerName) {
        // sets cardName in playerName hand to isPlayable = false
        for (var card of this.players[playerName].hand) {
            if (card.name === cardName) {
                card.isPlayable = false;
            }
        }
    }

    setAllPlayable(playerName) {
        // sets all cards in playerName hand to isPlayable = true
        for (var card of this.players[playerName].hand) {
            card.isPlayable = true;
        }
    }

    setAllNotPlayable(playerName) {
        // sets cards in playerName hand to isPlayable = false
        for (var card of this.players[playerName].hand) {
            card.isPlayable = false;
        }
    }

    putStackIntoDeck() {
        this.deck = this.stack;
        this.stack = []
     
        console.log("Stack shuffled into deck");
     
        this.shuffleDeck();
    }

    setIsLosingHealth(bool, player) {
        this.players[player].isLosingHealth = bool;
    }

    startGame() {
        // each player draws startingHandSize cards
        //this.shuffleDeck(); // TODO: uncomment
        for (var player of Object.keys(this.players)) {
            this.draw(this.players[player].character.startingHandSize, player);
        }


        const firstPlayerName = Object.keys(this.players).find(key => this.players[key].id === 0);
        this.setAllPlayable(firstPlayerName);
        this.setNotPlayable("Mancato!", firstPlayerName);
        this.setNotPlayable("Beer", firstPlayerName);

        console.log("Game started!");
    }

    endTurn() {
        //find who was previous player
        const previousPlayerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)
        // move playerRoundId forward
        this.playerRoundId += 1;
        if (this.playerRoundId >= this.numOfPlayers) {
            this.playerRoundId = 0;
        }
        const currentPlayerName = Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)

        this.setAllNotPlayable(previousPlayerName);

        this.setAllPlayable(currentPlayerName);     //TODO: dynamite, prison?
        if (this.health < this.maxHealth) {
             this.setPlayable(currentPlayerName, "Beer") // let player play beer if not max HP
        }
        this.setNotPlayable("Mancato!", currentPlayerName);

        console.log("End of turn, next player: ", currentPlayerName);
    }

    getAllPlayersInfo() {
        // returns array [{name, numberOfCards, health}]
        let state = [];
        for (var player of Object.keys(this.players)) {
            state.push({
                name: player,
                numberOfCards: this.players[player].hand.length,
                health: this.players[player].character.health,
                table: this.players[player].table
            })
        }
        return state;
    }

    getNumOfCardsInEachHand() {
        // returns array [{name, numberOfCards}]
        let state = [];
        for (var player of Object.keys(this.players)) {
            state.push({
                name: player,
                numberOfCards: this.players[player].hand.length})
        }
        return state;
    }

    healthOfEachPlayer() {
        // returns array [{name, numberOfCards}]
        // TODO: this is not being used
        let state = [];
        for (var player of Object.keys(this.players)) {
            state.push({
                name: player,
                healt: this.players[player].character.health})
        }
        return state;
    }

    getPlayersLosingHealth() {
        // return array [{name, isLosingHealth}]
        let state = [];
        for (var player of Object.keys(this.players)) {
            state.push({
                name: player,
                isLosingHealth: this.players[player].isLosingHealth
            })
        }
        return state;
    }

    getPlayersInRange(playerName, range) {
        // returns array of players closer than range to playerName
        // return array of all players if range === "max"

        const arr = Object.keys(this.players)   // array of player names;

        if (range === "max") return arr;        // on max range, return all

        const playerIndex = arr.indexOf(playerName) + arr.length;
        const concatArray = arr.concat(arr.concat(arr));    // = [...arr, ...arr, ...arr]
        let result = [];

        for (let i = 0; i < concatArray.length; i++) {
            if (Math.abs(i - playerIndex) <= range && i !== playerIndex) {
                result.push(concatArray[i]);
            }
        }
        return result;
    }

    getCurrentPlayer() {
        return Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)
    }

    getPlayerHand(playerName) {
        return (this.players[playerName].hand);
    }

    getHands() {
        for (var player of Object.keys(this.players)) {
            console.log(player, ": ", this.players[player].hand);
        }
    }

    getPlayerTurn() {
        console.log("Player turn : ", this.players[this.playerRoundId].name)
    }

    getTopStackCard() {
        return this.stack[this.stack.length - 1];
    }

    getDeck() {
        return this.deck;
    }

    getPlayers() {
        return this.players;
    }
}

module.exports = Game;