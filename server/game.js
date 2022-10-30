class Game {
    constructor(playerNames, deck) {
        this.numOfPlayers = playerNames.length;
        this.deck = deck;
        this.stack = [];
        this.emporio = [];
        this.players = {}
        this.playerRoundId = 0;
        this.bangCanBeUsed = true;
        this.duelActive = false;
        this.indianiActive = false;
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
                canUseBarel: true,
                hasDynamite: false,
                character: new function () {
                    return(
                        this.role = null,
                        this.maxHealth = 2 + (this.role === "Sheriffo" ? 1 : 0),
                        this.health = this.maxHealth - 1, //TODO: remove - 1
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

    // ******************* USE CARDS *******************
    useBang(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Bang!", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Bang! on ${target}`);

        this.setPlayable("Mancato!", target);
        if (this.players[target].canUseBarel) {
            this.setCardOnTablePlayable("Barilo", target);
        }

        this.setAllNotPlayable(playerName);
        if (this.players[playerName].table.filter(item => item.name === 'Vulcanic').length > 0) {
            // if player has Volcanic, don't block Bang!s
            // TODO: implement this for Billy the Kid
            this.bangCanBeUsed = true;
        } else {
            this.bangCanBeUsed = false;
        }

        this.playerPlaceHolder = playerName;    // save the name of player who used Bang!, so that his hand could be enabled after target player reaction
        
        this.setIsLosingHealth(true, target);
    }

    useBangOnIndiani(cardDigit, cardType, playerName) {
        this.discard("Bang!", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Bang! on Indiani`);

        this.setIsLosingHealth(false, playerName);

        // if there is player loosing health, return
        // if no player is found, set playable for playerPlaceholder
        for (const player of this.getPlayersLosingHealth()) {
            if (player.isLosingHealth) return;
        }
        this.setAllPlayable(this.playerPlaceHolder);
        this.setMancatoBeerNotPlayable(this.playerPlaceHolder);
        this.indianiActive = false;

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

        this.players[playerName].canUseBarel = true;

        this.setMancatoBeerNotPlayable(playerName);
        this.setCardOnTableNotPlayable("Barilo", playerName);
        
        if (!this.bangCanBeUsed) {
            this.setNotPlayable("Bang!", this.playerPlaceHolder);
        }
        
        this.setIsLosingHealth(false, playerName);

        // if there is player loosing health, return
        // if no player is found, set playable for playerPlaceholder
        for (const player of this.getPlayersLosingHealth()) {
            if (player.isLosingHealth) return;
        }
        this.setAllPlayable(this.playerPlaceHolder);
        this.setMancatoBeerNotPlayable(this.playerPlaceHolder);
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
        const cardInHandIndex = this.players[playerName].hand.findIndex(cardInHand => (cardInHand.name === card.name && cardInHand.digit === card.digit && cardInHand.type === card.type));
        this.players[playerName].hand.splice(cardInHandIndex, 1)[0]; // this can't be handled by this.discard() because decision must be made weather to push card on table or stack

        //let cardOnTableIndex;
        if (card.class === "horse") {
            // two horses allowed on table, so filter by name
            if (this.players[playerName].table.filter(cardOnTable => cardOnTable.name === card.name).length > 0) {
                // remove card from table
                const cardOnTableIndex = this.players[playerName].table.findIndex(cardOnTable => (cardOnTable.name === card.name));
                const removedCard = this.players[playerName].table.splice(cardOnTableIndex, 1)[0];
                this.stack.push(removedCard);
            }
        } else if (card.class === "dynamite") {
            
        } else {
            // only one gun card of same class allowed so filter by class
            if (this.players[playerName].table.filter(cardOnTable => cardOnTable.class === card.class).length > 0) {
                // remove card from table
                const cardOnTableIndex = this.players[playerName].table.findIndex(cardOnTable => (cardOnTable.name === card.name));
                const removedCard = this.players[playerName].table.splice(cardOnTableIndex, 1)[0];
                this.stack.push(removedCard);
            }
        }

        if (card.name === "Vulcanic") this.bangCanBeUsed = true;
        
        // put on table
        card.isPlayable = false;
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

    useSaloon(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Saloon", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Saloon`);

        for (const player of Object.keys(this.players)) {
            // put hit on all players, except playerName
            if (this.players[player].character.health < this.players[player].character.maxHealth) {
                this.players[player].character.health += 1;
            }
        }
    }

    useEmporio(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Emporio", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Emporio`);

        this.setAllNotPlayable(playerName);
        
        this.emporio = []; // this is not necessary, but to be sure
        for (let i = 0; i < this.numOfPlayers; i++) {
            this.emporio.push(this.deck[0])
            this.deck.shift();
        }
        this.nextEmporioTurn = playerName;
        this.playerPlaceHolder = playerName;
    }

    getEmporioCard(playerName, card) {
        const getCardIndex = this.emporio.findIndex(foundCard => (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type))
        // return if card not found
        if (getCardIndex < 0) return;
        // place card in player hand
        this.players[playerName].hand.push(this.emporio[getCardIndex]);
        // remove from emporio
        this.emporio.splice(getCardIndex, 1); 

        if (this.emporio.length <= 0) {
            this.setAllPlayable(this.playerPlaceHolder);
            this.setMancatoBeerNotPlayable(this.playerPlaceHolder);
            this.emporio = [];
            this.nextEmporioTurn = "";
            return;
        }
        const playerNames = Object.keys(this.players);
        let currentEmporioTurnPlayerIndex = playerNames.findIndex(player => player === this.nextEmporioTurn)
        currentEmporioTurnPlayerIndex += 1;
        if (currentEmporioTurnPlayerIndex >= this.numOfPlayers) {
            currentEmporioTurnPlayerIndex = 0;
        }
        this.nextEmporioTurn = playerNames[currentEmporioTurnPlayerIndex];

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

    useGatling(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Gatling", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Gatling`);

        for (const target of Object.keys(this.players)) {
            // put hit on all players, except playerName
            if (target !== playerName) {
                this.setPlayable("Mancato!", target);
                if (this.players[target].canUseBarel) {
                    this.setCardOnTablePlayable("Barilo", target);
                }
                
                this.setIsLosingHealth(true, target);
            }
        }

        this.setAllNotPlayable(playerName);

        this.playerPlaceHolder = playerName;    // save the name of player who used Bang!, so that his hand could be enabled after target player reaction
    
    }

    useIndiani(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Indiani", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Indiani`);

        for (const target of Object.keys(this.players)) {
            // put hit on all players, except playerName
            if (target !== playerName) {
                this.setPlayable("Bang!", target);
                
                this.setIsLosingHealth(true, target);
            }
        }

        this.indianiActive = true;

        this.setAllNotPlayable(playerName);

        this.playerPlaceHolder = playerName;    // save the name of player who used Bang!, so that his hand could be enabled after target player reaction
    }

    playPrigione(target, card, playerName = this.getNameOfCurrentTurnPlayer()) {
        // TODO: special case for Sheriffo
        // put prison in other players' table
        this.discard("Prigione", card.digit, card.type, playerName);
        console.log(`Player ${playerName} put ${target} in prison`);

        card.isPlayable = false;
        this.players[target].table.push(card);
    }

    useBarel(playerName) {
        const drawnCard = this.deck[0];
        this.deck.shift();
        this.stack.push(drawnCard)

        this.players[playerName].canUseBarel = false;
        this.setCardOnTableNotPlayable("Barilo", playerName);

        if (drawnCard.type === "hearts") {
            this.setIsLosingHealth(false, playerName);
            this.setNotPlayable("Mancato!", playerName);
            this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            this.setNotPlayable("Mancato!", this.getNameOfCurrentTurnPlayer());
            if (!this.bangCanBeUsed) {
                this.setNotPlayable("Bang!", this.getNameOfCurrentTurnPlayer())
            }
        }

        console.log(`Player ${playerName} drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} on barel`);
    }

    useDynamite(playerName, card) {
        card.isPlayable = false;
        const drawnCard = this.deck[0];
        this.deck.shift();
        this.stack.push(drawnCard)
        console.log(`Player ${playerName} drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} on dynamite`);

        // remove from playerName table card object
        this.players[playerName].table = this.players[playerName].table.filter(function( tableCard ) {
             return (tableCard.name !== card.name || tableCard.digit !== card.digit || tableCard.type !== card.type);
        });

        if (drawnCard.type === "spades" && (2 <= drawnCard.digit && drawnCard.digit <= 9)) {
            console.log("Dynamite exploded!");
            this.players[playerName].character.health -= 3; // lose 3 HP
        } else {
            const nextPlayer = Object.keys(this.players).find(key => this.players[key].id === (this.playerRoundId + 1) % this.numOfPlayers )
            this.players[nextPlayer].table.push(card);
        }
        
        if (!this.getPlayerHasDynamite(playerName) && !this.getPlayerIsInPrison(playerName)) {
            // if not dynamite on table, allow use cards
            this.setAllPlayable(playerName);
            this.setMancatoBeerNotPlayable(playerName);
            this.draw(2, playerName);
        }
    }

    usePrigione(playerName, card) {
        card.isPlayable = false;

        // place prison on stack
        this.stack.push(card)

        // draw card
        const drawnCard = this.deck[0];
        this.deck.shift();
        this.stack.push(drawnCard)
        console.log(`Player ${playerName} drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} on prison`);

        // remove from playerName table card object
        this.players[playerName].table = this.players[playerName].table.filter(function( tableCard ) {
             return (tableCard.name !== card.name || tableCard.digit !== card.digit || tableCard.type !== card.type);
        });

        if (drawnCard.type === "hearts") {
            if (!this.getPlayerHasDynamite(playerName) && !this.getPlayerIsInPrison(playerName)) {
                // if not dynamite on table, allow use cards
                this.setAllPlayable(playerName);
                this.setMancatoBeerNotPlayable(playerName);
                this.draw(2, playerName);
            }
        } else {
            // next player round
            this.endTurn();
        }
        
    }

    loseHealth(playerName) {
        this.players[playerName].character.health -= 1;

        this.players[playerName].canUseBarel = true;

        this.setIsLosingHealth(false, playerName);
        this.setMancatoBeerNotPlayable(playerName);
        this.setCardOnTableNotPlayable("Barilo", playerName)
        
        this.setAllPlayable(this.playerPlaceHolder);
        this.setMancatoBeerNotPlayable(this.playerPlaceHolder);

        console.log("this.bangCanBeUsed: ", this.bangCanBeUsed);
        console.log("this.playerPlaceHolder: ", this.playerPlaceHolder);

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
                this.setMancatoBeerNotPlayable(currentPlayer);
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

    // ******************* SETERS *******************
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

    setCardOnTablePlayable(cardName, playerName) {
        // sets cardName in playerName table to isPlayable = true
        for (var card of this.players[playerName].table) {
            if (card.name === cardName) {
                card.isPlayable = true;
            }
        }
    }

    setCardOnTableNotPlayable(cardName, playerName) {
        // sets cardName in playerName hand to isPlayable = false
        for (var card of this.players[playerName].table) {
            if (card.name === cardName) {
                card.isPlayable = false;
            }
        }
    }

    setAllCardsOnTableNotPlayable(playerName) {
        // sets cards in playerName hand to isPlayable = false
        for (var card of this.players[playerName].table) {
            card.isPlayable = false;
        }
    }

    setMancatoBeerNotPlayable(playerName) {
        this.setNotPlayable("Mancato!", playerName);
        if (this.players[playerName].character.health >= this.players[playerName].character.maxHealth) {
            this.setNotPlayable("Beer", playerName) // let player play beer if not max HP
        }
        
    }

    // ******************* GETERS *******************
    getAllPlayersInfo() {
        // returns array [{name, numberOfCards, health, table}]
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

    getPlayersWithActionRequired() {
        // return array [{name, hasDynamite}]
        // if is players current turn and has dynamite in table, set hasDynamite = true
        let state = [];
        for (var player of Object.keys(this.players)) {
            // if player is on turn and has dynamite on table
            let dynamiteFound = false;
            let prisonFound = false;
            if (player === this.getNameOfCurrentTurnPlayer()) {
                if (this.getPlayerHasDynamite(player)) {
                    dynamiteFound = true
                } 
                if (this.getPlayerIsInPrison(player)) {
                    prisonFound = true;
                }
            }
            state.push({
                name: player,
                hasDynamite: dynamiteFound,
                isInPrison: prisonFound,
            })
        }
        return state;
    }

    getPlayersInRange(playerName, range) {
        // returns array of players closer than range to playerName
        // return array of all players if range === "max"
        
        const playerNames = Object.keys(this.players)   // array of player names;
        
        if (range === "max") return playerNames;        // on max range, return all

        // ******** MAX RANGE BUT NOT SHERIFFO ********
        if (range === "max_not_sheriffo") {
            // max range but exclude sheriff
            let result = [];
            for (const player of playerNames) {
                if (player !== playerName && this.players[player].character.role !== "Sheriffo") {
                    result.push(player);
                }
            }
            return result;
        }
        
        // ******** CUSTOM RANGE ********
        if (this.players[playerName].table.some(card => card.name === 'Apaloosa')) {
            // if player has Apaloosa, increase range by 1
            range += 1;
        }

        const playerIndex = playerNames.indexOf(playerName) + playerNames.length;
        const concatArray = playerNames.concat(playerNames.concat(playerNames));    // = [...arr, ...arr, ...arr]
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

    getPlayerHand(playerName) {
        return (this.players[playerName].hand);
    }

    getHands() {
        for (var player of Object.keys(this.players)) {
            console.log(player, ": ", this.players[player].hand);
        }
    }

    getPlayerHasDynamite(playerName) {
        return (this.players[playerName].table.some(card => card.name === 'Dynamite'));
    }

    getPlayerIsInPrison(playerName) {
        return (this.players[playerName].table.some(card => card.name === 'Prigione'));
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
        // returns name of player who is on turn
        return Object.keys(this.players).find(key => this.players[key].id === this.playerRoundId)
    }

    // ******************* GAME FLOW *******************
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
        this.draw(2, firstPlayerName);
        this.setAllPlayable(firstPlayerName);
        this.setMancatoBeerNotPlayable(firstPlayerName)

        console.log("Game started!");
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

    endTurn() {
        //find who was previous player
        const previousPlayerName = this.getNameOfCurrentTurnPlayer()
        // move playerRoundId forward
        this.playerRoundId += 1;
        // TODO: numOfPlayers changes on death
        if (this.playerRoundId >= this.numOfPlayers) {
            this.playerRoundId = 0;
        }
        const currentPlayerName = this.getNameOfCurrentTurnPlayer()

        this.setAllNotPlayable(previousPlayerName);

        if (this.getPlayerHasDynamite(currentPlayerName)) {
            console.log("Activate dynamite: ", currentPlayerName);
            this.players[currentPlayerName].hasDynamite = true;
            this.setCardOnTablePlayable("Dynamite", currentPlayerName);
        }

        if (this.getPlayerIsInPrison(currentPlayerName)) {
            console.log("Activate prison: ", currentPlayerName);
            this.players[currentPlayerName].isInPrison = true;
            this.setCardOnTablePlayable("Prigione", currentPlayerName);
        } 
        
        if (!this.getPlayerHasDynamite(currentPlayerName) && !this.getPlayerIsInPrison(currentPlayerName)) {
            this.draw(2, currentPlayerName);
            this.setAllPlayable(currentPlayerName);     //TODO: dynamite, prison?
            this.setNotPlayable("Mancato!", currentPlayerName);
            if (this.players[currentPlayerName].character.health >= this.players[currentPlayerName].character.maxHealth) {
                this.setNotPlayable("Beer", currentPlayerName);
            }
        }

        console.log("End of turn, next player: ", currentPlayerName);

    }
}

module.exports = Game;