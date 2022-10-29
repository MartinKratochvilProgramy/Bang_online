class Game {
    constructor(playerNames, deck) {
        this.numOfPlayers = playerNames.length;
        this.deck = deck;
        this.stack = [];
        this.players = {}
        this.playerRoundId = 0;
        this.bangCanBeUsed = true;
        this.duelActive = false;
        this.duelPlayers = null;
        this.duelTurnIndex = 0;
        this.playerPlaceHolder = null;

        // init players
        for (let i = 0; i < this.numOfPlayers; i++) {
            this.players[playerNames[i]] = {
                id: i,
                hand: [],
                table: [],
                isLosingHealth: false,
                character: new function () {
                    return(
                        this.role = null,
                        this.maxHealth = 2 + (this.role === "Sheriffo" ? 1 : 0),
                        this.health = this.maxHealth,
                        this.startingHandSize = this.maxHealth
                    )
                }
            }
        }
    }

    draw(numToDraw, playerName = this.getNameOfCurrentTurnPlayer()) {
        // put nomToDraw cards into hand of current playerRoundId
        // remove top card from deck
        
        const currentTurnPlayerName = this.getNameOfCurrentTurnPlayer();
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

    discard(cardName, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        // remove card from playerName hand and place it to the end of stack

        // remove card from hand
        const cardIndex = this.players[playerName].hand.findIndex(card => (card.name === cardName && card.digit === cardDigit && card.type === cardType));
        const cardToDiscard = this.players[playerName].hand.splice(cardIndex, 1)[0];
        cardToDiscard.isPlayable = false;
        // place card on deck
        this.stack.push(cardToDiscard);

    }

    useBang(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Bang!", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Bang! on ${target}`);

        this.setPlayable("Mancato!", target);

        this.setAllNotPlayable(playerName);
        if (!this.players[playerName].table.filter(item => item.name === 'Volcanic').length > 0) {
            // if player has Volcanic, don't block Bang!s
            // TODO: implement this for Billy the Kid
            this.bangCanBeUsed = false;
        }

        this.playerPlaceHolder = playerName;    // save the name of player who used Bang!, so that his hand could be enabled after target player reaction
        
        this.setIsLosingHealth(true, target);
    }

    useBangInDuel(cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        // special case of Bang! use, sets the next turn of the duel state

        this.discard("Bang!", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Bang! in duel`);

        this.setNotPlayable("Bang!", this.duelPlayers[this.duelTurnIndex]);
        this.setIsLosingHealth(false, this.duelPlayers[this.duelTurnIndex]);
        this.setAllNotPlayable(playerName);
        
        // shift to the next player in duel (duelPlayers.length should always = 2)
        this.duelTurnIndex = (this.duelTurnIndex + 1) % 2;
        console.log("Next player: ", this.duelPlayers[this.duelTurnIndex]);
        // set next players Ban!g cards playable
        // TODO: character exception
        this.setPlayable("Bang!", this.duelPlayers[this.duelTurnIndex]);
        this.setIsLosingHealth(true, this.duelPlayers[this.duelTurnIndex]);
        
    }

    useMancato(playerName, cardDigit, cardType) {
        this.discard("Mancato!", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Mancato!`);

        this.setMancatoBangNotPlayable(playerName);
        this.setAllPlayable(this.playerPlaceHolder);
        this.setMancatoBangNotPlayable(this.playerPlaceHolder);
        if (!this.bangCanBeUsed) {
            this.setNotPlayable("Bang!", this.playerPlaceHolder);
        }

        this.setIsLosingHealth(false, playerName);
    }

    useCatBallou(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        // TODO: this only works on cards in hand, not table
        this.discard("Cat Ballou", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Cat Ballou`);

        // get random card from target hand
        const randomCard = this.getPlayerHand(target)[Math.floor(Math.random()*this.getPlayerHand(target).length)]

        this.discard(randomCard.name, randomCard.digit, randomCard.type, target);
        console.log(`Player ${target} discarded ${randomCard.name}`);
    }

    useCatBallouOnTableCard(activeCard, target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Cat Ballou", activeCard.digit, activeCard.type, playerName);
        console.log(`Player ${playerName} used Cat Ballou`);
        
        for (let player of Object.keys(this.players)) {
            // remove from table object where name === target
            for (let j = 0; j < this.players[player].table.length; j++) {
                if (this.players[player].table[j].name === target && this.players[player].table[j].digit === cardDigit && this.players[player].table[j].type === cardType) {
                    const foundCard = this.players[player].table.splice(j, 1)[0];
                    this.stack.push(foundCard);
                }
            }
        }
    }

    usePanico(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Panico", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Panico`);
        
        // if targer is player, steal random card from his hand
        // get random card from target hand
        const randomCard = this.getPlayerHand(target)[Math.floor(Math.random()*this.getPlayerHand(target).length)]
        if (randomCard.name === "Mancato!") {
            // if chosen card Mancato! set isNotPlayable
            randomCard.isPlayable = false
        } else if (randomCard.name === "Bang!" && !this.bangCanBeUsed) {
            // if chosen card Bang! set isNotPlayable if Bang! can!t be used
            randomCard.isPlayable = false;
        } else {
            // set playable
            randomCard.isPlayable = true;
        }
        
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

    usePanicoOnTableCard(activeCard, target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Panico", activeCard.digit, activeCard.type, playerName);
        console.log(`Player ${playerName} used Panico`);

        
        for (let player of Object.keys(this.players)) {
            // remove from table object where name === target
            for (let j = 0; j < this.players[player].table.length; j++) {
                if (this.players[player].table[j].name === target && this.players[player].table[j].digit === cardDigit && this.players[player].table[j].type === cardType) {
                    const foundCard = this.players[player].table.splice(j, 1)[0];
                    this.players[playerName].hand.push(foundCard);
                }
            }
        }
    }

    placeBlueCardOnTable(card, playerName = this.getNameOfCurrentTurnPlayer()) {
        // const cardInHandIndex = this.players[playerName].hand.findIndex(cardInHand => (cardInHand.name === card.name && cardInHand.digit === card.digit && cardInHand.type === card.type));
        // this.players[playerName].hand.splice(cardInHandIndex, 1)[0];

        this.discard(card.name, card.digit, card.type, playerName);
        
        //let cardOnTableIndex;
        if (card.class === "horse") {
            // two horses allowed on table, so filter by name
            if (this.players[playerName].table.filter(cardOnTable => cardOnTable.name === card.name).length > 0) {
                // remove card from table
                const cardOnTableIndex = this.players[playerName].table.findIndex(cardOnTable => (cardOnTable.name === card.name));
                const removedCard = this.players[playerName].table.splice(cardOnTableIndex, 1)[0];
                this.stack.push(removedCard);
            }
        } else {
            // only one gun card of same class allowed so filter by class
            if (this.players[playerName].table.filter(cardOnTable => cardOnTable.class === card.class).length > 0) {
                // remove card from table
                const cardOnTableIndex = this.players[playerName].table.findIndex(cardOnTable => (cardOnTable.name === card.name));
                const removedCard = this.players[playerName].table.splice(cardOnTableIndex, 1)[0];
                this.stack.push(removedCard);
            }
        }

        // if on table, replace it
        this.players[playerName].table.push(card);
        console.log(`Player ${playerName} placed ${card.name} on table`);
    }

    useBeer(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Beer", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Beer`);

        this.players[playerName].character.health += 1;

        if (this.players[playerName].character.health >= this.players[playerName].character.maxHealth) {
            this.setNotPlayable("Beer", playerName) // do not let player play beer if not max HP
        }
    }

    useDiligenza(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Diligenza", cardDigit, cardType);
        console.log(`Player ${playerName} used Diligenza`);

        this.draw(2, playerName);
    }

    useWellsFargo(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Wells Fargo", cardDigit, cardType);
        console.log(`Player ${playerName} used Wells Fargo`);

        this.draw(3, playerName);
    }

    useDuel(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Duel", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Duel on ${target}`);

        this.duelPlayers = [target, playerName];
        this.duelTurnIndex = 0;

        this.setPlayable("Bang!", target);
        this.setIsLosingHealth(true, target);
        
        this.setAllNotPlayable(playerName);

        this.duelActive = true;
        this.playerPlaceHolder = playerName;    // save the name of player who used duel, so that his hand could be enabled after target player reaction
        
    }

    loseHealth(playerName) {
        this.players[playerName].character.health -= 1;

        this.setIsLosingHealth(false, playerName);
        this.setMancatoBangNotPlayable(playerName);
        
        this.setAllPlayable(this.playerPlaceHolder);
        this.setMancatoBangNotPlayable(this.playerPlaceHolder);

        if (!this.bangCanBeUsed) {
            this.setNotPlayable("Bang!", this.playerPlaceHolder);
        }
        if (this.duelActive) {
            this.duelActive = false;
            this.duelTurnIndex = 0;
            this.duelPlayers = null;
            if (this.bangCanBeUsed) {
                const currentPlayer = this.getNameOfCurrentTurnPlayer();
                this.setNotPlayable("Bang!", playerName);
                this.setAllPlayable(currentPlayer);
                this.setMancatoBangNotPlayable(currentPlayer);
            }
        }
        // if player were to day, allow him to play beer
        if (this.players[playerName].character.health <= 0) {
            console.log("Hand: ", this.players[playerName].hand);
            for (const card of this.players[playerName].hand) {
                if (card.name === "Beer") {
                    console.log("Losing: ", card.digit, card.type);
                    this.useBeer(playerName, card.digit, card.type);
                    return;
                }
            }
            // TODO: LOSE GAME
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

    setMancatoBangNotPlayable(playerName) {
        this.setNotPlayable("Mancato!", playerName);
        if (this.players[playerName].character.health >= this.players[playerName].character.maxHealth) {
            this.setNotPlayable("Beer", playerName) // let player play beer if not max HP
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
        this.setMancatoBangNotPlayable(firstPlayerName)

        console.log("Game started!");
    }

    endTurn() {
        //find who was previous player
        const previousPlayerName = this.getNameOfCurrentTurnPlayer()
        // move playerRoundId forward
        this.playerRoundId += 1;
        if (this.playerRoundId >= this.numOfPlayers) {
            this.playerRoundId = 0;
        }
        const currentPlayerName = this.getNameOfCurrentTurnPlayer()

        this.setAllNotPlayable(previousPlayerName);

        this.draw(2, currentPlayerName);
        this.setAllPlayable(currentPlayerName);     //TODO: dynamite, prison?
        this.setMancatoBangNotPlayable(currentPlayerName);


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
        
        if (this.players[playerName].table.some(card => card.name === 'Apaloosa')) {
            // if player has Apaloosa, increase range by 1
            range += 1;
        }

        const playerIndex = arr.indexOf(playerName) + arr.length;
        const concatArray = arr.concat(arr.concat(arr));    // = [...arr, ...arr, ...arr]
        let result = [];

        for (let i = 0; i < concatArray.length; i++) {
            const currentName = concatArray[i];

            if (currentName !== playerName) {
                if (this.players[currentName].table.some(card => card.name === 'Mustang')) {
                    // if player has Mustang, decrease range temporarily by 1
                    if (Math.abs(i - playerIndex) <= range - 1) {
                        result.push(currentName);
                    }
                } else if (Math.abs(i - playerIndex) <= range) {
                    // if not Mustang, continue normally
                    result.push(currentName);
                }
            };
            
        }
        return result;
    }

    getCurrentPlayer() {
        return this.getNameOfCurrentTurnPlayer()
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

    getNameOfCurrentTurnPlayer () {
        return Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)
    }
}

module.exports = Game;