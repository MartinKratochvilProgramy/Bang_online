class Game {
    constructor(playerNames, deck) {
        this.numOfPlayers = playerNames.length;
        this.namesOfCharacters = ["Bart Cassidy", "Black Jack", "Calamity Janet", "El Gringo", "Jesse Jones", "Jourdonnais", "Kit Carlson", "Lucky Duke", "Paul Regret", "Pedro Ramirez", "Rose Doolan", "Sid Ketchum", "Slab the Killer", "Suzy Lafayette", "Vulture Sam", "Willy the Kid"] 
        // this.namesOfCharacters = ["Slab the Killer", "Calamity Janet", "Jourdonnais", "El Gringo"] 
        this.knownRoles = {}
        this.deck = [...deck];  // create new copy of deck
        this.gameEnded = false;
        this.stack = [];
        this.emporio = [];
        this.drawChoice = [];
        this.players = {}
        this.playerRoundId = 0;
        this.bangCanBeUsed = true;
        this.duelActive = false;
        this.indianiActive = false;
        this.gatlingActive = false;
        this.duelPlayers = [];
        this.duelTurnIndex = 0;
        this.luckyDukeFirstDraw = true;
        this.sidKetchumDiscarded = false;
        this.awaitDrawChoice = false;

        // init players
        for (let i = 0; i < this.numOfPlayers; i++) {
            this.players[playerNames[i]] = {
                id: i,
                hand: [],
                table: [],
                isLosingHealth: false,
                mancatoPool: 0,
                character: {
                    name: null,
                    role: null
                }
            }
        }
    }

    draw(numToDraw, playerName = this.getNameOfCurrentTurnPlayer()) {
        // put nomToDraw cards into hand of current playerRoundId
        // remove top card from deck
        
        if (this.deck.length <= 8) {
            this.putStackIntoDeck();
        }
        for (let i = 0; i < numToDraw; i++) {
            // if no cards in deck, put stack into deck
            if (this.deck.length <= 0) this.putStackIntoDeck();

            const card = this.deck[0];
            card.isPlayable = false;
            this.players[playerName].hand.push(card);
            this.deck.shift();
        }


        if (numToDraw === 1) {
            return [`${playerName} drew ${numToDraw} card`];
        } else {
            return [`${playerName} drew ${numToDraw} cards`];
        }
    }

    drawFromDeck(numToDraw, playerName = this.getNameOfCurrentTurnPlayer()) {
        // put nomToDraw cards into hand of current playerRoundId
        // remove top card from deck
        
        if (this.deck.length <= 0) {
            this.putStackIntoDeck();
        }
        for (let i = 0; i < numToDraw; i++) {
            // if no cards in deck, put stack into deck
            if (this.deck.length === 0) this.putStackIntoDeck();

            const card = this.deck[0];
            this.players[playerName].hand.push(card);
            this.deck.shift();
        }

        this.setAllPlayable(playerName);

        if (this.players[playerName].character.name === "Jesse Jones" || this.players[playerName].character.name === "Pedro Ramirez") {
            this.awaitDrawChoice = false;
        }

        if (numToDraw === 1) {
            return [`${playerName} drew ${numToDraw} card`];
        } else {
            return [`${playerName} drew ${numToDraw} cards`];
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

        // SK special case for when discard 2 => gain life
        if (this.players[playerName].character.name === "Sid Ketchum") {
            if (this.sidKetchumDiscarded === true && this.players[playerName].character.health < this.players[playerName].character.maxHealth) {
                this.players[playerName].character.health += 1
                this.sidKetchumDiscarded = false;
            } else {
                this.sidKetchumDiscarded = true;
            }
        }
    }

    // ******************* USE CARDS *******************
    useBang(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Bang!", cardDigit, cardType, playerName);
        this.setAllNotPlayable(playerName);

        this.setIsLosingHealth(true, target);
        this.players[target].mancatoPool = 1;
        if (this.players[playerName].character.name === "Slab the Killer") {
            // need 2 Mancato! on StK
            this.players[target].mancatoPool += 1;
        }
        
        this.setPlayable("Mancato!", target);
        if (this.players[target].character.name === "Calamity Janet") {
            this.setPlayable("Bang!", target);
        }
        this.setCardOnTablePlayable("Barilo", target);
        
        if (this.players[playerName].table.filter(item => item.name === 'Vulcanic').length > 0 || this.players[playerName].character.name === "Willy the Kid") {
            // if player has Volcanic or is Willy the Kid don't block Bang!s
            this.bangCanBeUsed = true;
        } else {
            this.bangCanBeUsed = false;
        }

        return [`${playerName} used Bang! on ${target}`];
    }
    
    useBangAsCJ(playerName, cardDigit, cardType) {
        let message = [];
        this.players[playerName].mancatoPool -= 1;

        this.discard("Bang!", cardDigit, cardType, playerName);
        message.push(`${playerName} used Bang! as Mancato!`);

        if (this.players[playerName].mancatoPool === 0) {
            this.setCardOnTableNotPlayable("Barilo", playerName);
            this.setAllNotPlayable(playerName);
            
            this.setIsLosingHealth(false, playerName);

            // if there is player loosing health, return
            // if no player is found, set playable for playerPlaceholder
            for (const player of this.getPlayersLosingHealth()) {
                if (player.isLosingHealth) return message;
            }

            this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
        }

        return message;
    }

    useBangOnIndiani(cardDigit, cardType, playerName) {
        this.discard("Bang!", cardDigit, cardType, playerName);

        this.setIsLosingHealth(false, playerName);
        this.setAllNotPlayable(playerName);

        // if there is player loosing health, return
        // if no player is found, set playable for playerPlaceholder
        for (const player of this.getPlayersLosingHealth()) {
            if (player.isLosingHealth) return [`${playerName} used Bang!`];
        }
        this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
        this.indianiActive = false;

        return [`${playerName} used Bang!`];
    }

    useMancatoOnIndiani(cardDigit, cardType, playerName) {
        this.discard("Mancato!", cardDigit, cardType, playerName);

        this.setIsLosingHealth(false, playerName);
        this.setAllNotPlayable(playerName);

        // if there is player loosing health, return
        // if no player is found, set playable for playerPlaceholder
        for (const player of this.getPlayersLosingHealth()) {
            if (player.isLosingHealth) return [`${playerName} used Mancato! as Bang!`];
        }
        this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
        this.indianiActive = false;

        return [`${playerName} used Mancato! as Bang!`];
    }

    useBangInDuel(cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        // special case of Bang! use, sets the next turn of the duel state

        this.discard("Bang!", cardDigit, cardType, playerName);

        this.setNotPlayable("Bang!", this.duelPlayers[this.duelTurnIndex]);
        this.setIsLosingHealth(false, this.duelPlayers[this.duelTurnIndex]);
        this.setAllNotPlayable(playerName);
        
        // shift to the next player in duel (duelPlayers.length should always = 2)
        this.duelTurnIndex = (this.duelTurnIndex + 1) % 2;
        // set next players Ban!g cards playable
        this.setPlayable("Bang!", this.duelPlayers[this.duelTurnIndex]);
        if (this.players[this.duelPlayers[this.duelTurnIndex]].character.name === "Calamity Janet") {
            this.setPlayable("Mancato!", this.duelPlayers[this.duelTurnIndex]);
        }
        this.setIsLosingHealth(true, this.duelPlayers[this.duelTurnIndex]);
        
        return [`${playerName} used Bang! in duel`];
    }

    useMancato(playerName, cardDigit, cardType) {
        let message = [`${playerName} used Mancato!`];

        this.discard("Mancato!", cardDigit, cardType, playerName);

        this.players[playerName].mancatoPool -=1;

        if (this.players[playerName].mancatoPool === 0) {
            this.setAllNotPlayable(playerName);
            this.setCardOnTableNotPlayable("Barilo", playerName);
            this.setIsLosingHealth(false, playerName);

            if (this.indianiActive) {
                // CJ can play Mancato! on Indiani, so disable all cards if this happens
                this.setAllNotPlayable(playerName);
            }
            
            // if there is player loosing health, return
            // if no player is found, set playable for playerPlaceholder
            for (const player of this.getPlayersLosingHealth()) {
                if (player.isLosingHealth) return message;
            }
            this.gatlingActive = false;
            this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            
        }
        
        return message;
    }

    useMancatoInDuel(cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        // special case of Bang! use, sets the next turn of the duel state

        this.discard("Mancato!", cardDigit, cardType, playerName);

        this.setNotPlayable("Bang!", this.duelPlayers[this.duelTurnIndex]);
        this.setNotPlayable("Mancato!", this.duelPlayers[this.duelTurnIndex]);
        this.setIsLosingHealth(false, this.duelPlayers[this.duelTurnIndex]);
        this.setAllNotPlayable(playerName);
        
        // shift to the next player in duel (duelPlayers.length should always = 2)
        this.duelTurnIndex = (this.duelTurnIndex + 1) % 2;
        // set next players Ban!g cards playable
        this.setPlayable("Bang!", this.duelPlayers[this.duelTurnIndex]);
        this.setIsLosingHealth(true, this.duelPlayers[this.duelTurnIndex]);

        return [`${playerName} used Mancato! as Bang! in duel`];
    }

    useMancatoAsCJ(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Mancato!", cardDigit, cardType, playerName);

        this.players[target].mancatoPool = 1;

        this.setPlayable("Mancato!", target);
        this.setCardOnTablePlayable("Barilo", target);

        this.setAllNotPlayable(playerName);
        if (this.players[playerName].table.filter(item => item.name === 'Vulcanic').length > 0 || this.players[playerName].character.name === "Willy the Kid") {
            // if player has Volcanic or is Willy the Kid don't block Bang!s
            this.bangCanBeUsed = true;
        } else {
            this.bangCanBeUsed = false;
        }

        this.setIsLosingHealth(true, target);

        return [`${playerName} used Mancato! as Bang! on ${target}`];
    }

    useCatBallou(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        let message = [];
        this.discard("Cat Balou", cardDigit, cardType, playerName);
        message.push(`${playerName} used Cat Balou on ${target}`);

        // get random card from target hand
        const randomCard = this.getPlayerHand(target)[Math.floor(Math.random()*this.getPlayerHand(target).length)]

        this.discard(randomCard.name, randomCard.digit, randomCard.type, target);
        message.push(`${target} used ${randomCard.name}`);
        
        return message;
    }

    useCatBallouOnTableCard(activeCard, target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Cat Balou", activeCard.digit, activeCard.type, playerName);
        
        for (let player of Object.keys(this.players)) {
            // remove from table object where name === target
            for (let j = 0; j < this.players[player].table.length; j++) {
                if (this.players[player].table[j].name === target && this.players[player].table[j].digit === cardDigit && this.players[player].table[j].type === cardType) {
                    const foundCard = this.players[player].table.splice(j, 1)[0];
                    this.stack.push(foundCard);
                }
            }
        }
        return [`${playerName} used Cat Balou on ${target}`];
    }

    usePanico(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Panico", cardDigit, cardType, playerName);
        
        // if targer is player, steal random card from his hand
        // get random card from target hand
        const randomCard = this.getPlayerHand(target)[Math.floor(Math.random()*this.getPlayerHand(target).length)]
        if (!randomCard) return;
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

        return [`${playerName} used Panico on ${target}`];
    }

    usePanicoOnTableCard(activeCard, target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Panico", activeCard.digit, activeCard.type, playerName);
        
        for (let player of Object.keys(this.players)) {
            // remove from table object where name === target
            for (let j = 0; j < this.players[player].table.length; j++) {
                if (this.players[player].table[j].name === target && this.players[player].table[j].digit === cardDigit && this.players[player].table[j].type === cardType) {
                    const foundCard = this.players[player].table.splice(j, 1)[0];
                    foundCard.isPlayable = true;
                    this.players[playerName].hand.push(foundCard);
                }
            }
        }

        return [`${playerName} used Panico on ${target}`];
    }

    placeBlueCardOnTable(card, playerName = this.getNameOfCurrentTurnPlayer()) {
        const cardInHandIndex = this.players[playerName].hand.findIndex(cardInHand => (cardInHand.name === card.name && cardInHand.digit === card.digit && cardInHand.type === card.type));
        this.players[playerName].hand.splice(cardInHandIndex, 1)[0]; // this can't be handled by this.discard() because decision must be made weather to push card on table or stack

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
                const cardOnTableIndex = this.players[playerName].table.findIndex(foundCard => (foundCard.class === card.class));
                const removedCard = this.players[playerName].table.splice(cardOnTableIndex, 1)[0];
                if (removedCard.name === "Vulcanic") this.bangCanBeUsed = false;
                this.stack.push(removedCard);
            }
        }

        if (card.name === "Vulcanic") {
            this.bangCanBeUsed = true;
            // reset Bang!s in player hand to playable again
            for (const card of this.players[playerName].hand) {
                if (card.name === "Bang!") {
                    card.isPlayable = true;
                }
            }
        }
        
        // put on table
        card.isPlayable = false;
        this.players[playerName].table.push(card);
        return [`${playerName} placed ${card.name} on table`];
    }

    useBeer(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Beer", cardDigit, cardType, playerName);
        
        this.players[playerName].character.health += 1;
        
        if (this.players[playerName].character.health >= this.players[playerName].character.maxHealth) {
            this.setNotPlayable("Beer", playerName) // do not let player play beer if not max HP
        }
        return [`${playerName} used Beer`];
    }

    useSaloon(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Saloon", cardDigit, cardType, playerName);
        
        for (const player of Object.keys(this.players)) {
            // put hit on all players, except playerName
            if (this.players[player].character.health > 0 && this.players[player].character.health < this.players[player].character.maxHealth) {
                this.players[player].character.health += 1;
            }
        }

        return [`${playerName} used Saloon`];
    }

    useEmporio(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Emporio", cardDigit, cardType, playerName);
        
        this.setAllNotPlayable(playerName);
        
        this.emporio = []; // this is not necessary, but to be sure
        for (let player of Object.keys(this.players)) {
            if (this.players[player].character.health > 0) {
                // don't include dead players in Emporio
                this.emporio.push(this.deck[0])
                this.deck.shift();
            }
        }
        this.nextEmporioTurn = playerName;
        
        return [`${playerName} used Emporio`];
    }

    getEmporioCard(playerName, card) {
        const getCardIndex = this.emporio.findIndex(foundCard => (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type))
        // return if card not found
        if (getCardIndex < 0) return;
        const emporioCard = this.emporio[getCardIndex];
        card.isPlayable = false;
        // place card in player hand
        this.players[playerName].hand.push(emporioCard);
        // remove from emporio
        this.emporio.splice(getCardIndex, 1); 

        if (this.emporio.length <= 0) {
            // end when no cards to draw
            this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            this.emporio = [];
            this.nextEmporioTurn = "";
            return;
        }
        const playerNames = Object.keys(this.players);
        let currentEmporioTurnPlayerIndex = playerNames.findIndex(player => player === this.nextEmporioTurn)
            // find next alive player
            for (let i = 0; i < this.numOfPlayers; i++) {
                currentEmporioTurnPlayerIndex += 1;
                if (currentEmporioTurnPlayerIndex >= this.numOfPlayers) {
                    currentEmporioTurnPlayerIndex = 0;
                }
                const nextPlayer = Object.keys(this.players).find(key => this.players[key].id === currentEmporioTurnPlayerIndex);
                if (this.players[nextPlayer].character.health > 0) {
                    //this.players[nextPlayer].table.push(card);
                    break;
                }
            }
        this.nextEmporioTurn = playerNames[currentEmporioTurnPlayerIndex];
    }

    getChoiceCardKC(playerName, card) {
        const getCardIndex = this.drawChoice.findIndex(foundCard => (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type))
        // return if card not found
        if (getCardIndex < 0) return;
        // place card in player hand
        this.players[playerName].hand.push(this.drawChoice[getCardIndex]);
        // remove from drawChoice
        this.drawChoice.splice(getCardIndex, 1); 

        if (this.drawChoice.length === 1) {
            this.stack.push(this.drawChoice[0]);
            // end when no cards to draw
            this.setAllPlayable(playerName);
            this.drawChoice = [];
            return;
        }
    }

    getChoiceCardLD(playerName, card) {
        const getCardIndex = this.drawChoice.findIndex(foundCard => (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type))
        // return if card not found
        if (getCardIndex < 0) return;
        // place card in player hand
        this.players[playerName].hand.push(this.drawChoice[getCardIndex]);
        // remove from drawChoice
        this.drawChoice.splice(getCardIndex, 1); 

        if (this.luckyDukeFirstDraw) {
            this.stack.push(this.drawChoice[0])
            // end when no cards to draw
            this.luckyDukeFirstDraw = false;
            this.drawChoice = [];
            for (let i = 0; i < 2; i++) {
                const card = this.deck[0];
                this.drawChoice.push(card);
                this.deck.shift();
            }
            return;
        } else {
            this.stack.push(this.drawChoice[0])
            this.setAllPlayable(playerName);
            this.drawChoice = [];
            this.luckyDukeFirstDraw = true;
            return;
        }
    }

    getStackCardPR(playerName) {
        // place card in player hand
        this.players[playerName].hand.push(this.getTopStackCard());
        // remove from stack
        this.stack.pop();
        
        this.draw(1, playerName);
        
        this.setAllPlayable(playerName);
        
        this.awaitDrawChoice = false;
        
        return ["Pedro Ramirez drew first crad from stack"];
    }
    
    useDiligenza(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Diligenza", cardDigit, cardType);
        
        this.draw(2, playerName);
        
        this.setAllPlayable(playerName);
        
        return [`${playerName} used Diligenza`];
    }
    
    useWellsFargo(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Wells Fargo", cardDigit, cardType);
        
        this.draw(3, playerName);

        this.setAllPlayable(playerName);
        
        return [`${playerName} used Wells Fargo`];
    }

    useDuel(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Duel", cardDigit, cardType, playerName);
        
        this.duelPlayers = [target, playerName];
        this.duelTurnIndex = 0;
        
        this.setPlayable("Bang!", target);
        if (this.players[target].character.name === "Calamity Janet") {
            this.setPlayable("Mancato!", this.duelPlayers[this.duelTurnIndex]);
        }
        this.setIsLosingHealth(true, target);
        
        this.setAllNotPlayable(playerName);
        
        this.duelActive = true;
        
        return [`${playerName} used Duel on ${target}`];
    }

    useGatling(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Gatling", cardDigit, cardType, playerName);
        
        if (this.players[playerName].character.name === "Slab the Killer") {
            this.gatlingActive = true;
        }
        
        for (const target of Object.keys(this.players)) {
            // put hit on all players, except playerName and dead players
            if (target !== playerName && this.players[target].character.health > 0) {
                this.setPlayable("Mancato!", target);
                if (this.players[target].character.name === "Calamity Janet") {
                    this.setPlayable("Bang!", target);
                }
                this.setCardOnTablePlayable("Barilo", target);
                
                this.setIsLosingHealth(true, target);
                this.players[target].mancatoPool =1;
            }
        }
        
        this.setAllNotPlayable(playerName);
        
        return [`${playerName} used Gatling`];
    }

    useIndiani(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Indiani", cardDigit, cardType, playerName);
        
        for (const target of Object.keys(this.players)) {
            // put hit on all players, except playerName
            if (target !== playerName && this.players[target].character.health > 0) {
                this.setPlayable("Bang!", target);
                if (this.players[target].character.name === "Calamity Janet") {
                    this.setPlayable("Mancato!", target);
                }
                
                this.setIsLosingHealth(true, target);
            }
        }
        
        this.indianiActive = true;
        
        this.setAllNotPlayable(playerName);
        
        return [`${playerName} used Indiani`];
    }
    
    playPrigione(target, card, playerName = this.getNameOfCurrentTurnPlayer()) {
        // put prison in other players' table
        const cardIndex = this.players[playerName].hand.findIndex(foundCard => (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type));
        this.players[playerName].hand.splice(cardIndex, 1)[0];
        
        card.isPlayable = false;
        this.players[target].table.push(card);
        
        return [`${playerName} put ${target} in prison`];
    }

    useBarel(playerName) {
        let message;

        const drawnCard = this.deck[0];
        this.deck.shift();
        this.stack.push(drawnCard);
        
        message = [`${playerName} drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} on barel`];

        this.setCardOnTableNotPlayable("Barilo", playerName);

        if (drawnCard.type === "hearts") {
            this.players[playerName].mancatoPool -= 1;

            if (this.players[playerName].mancatoPool === 0) {
                this.setAllNotPlayable(playerName);
                this.setIsLosingHealth(false, playerName);

                this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            }
        }

        return message;
    }

    useDynamite(playerName, card) {
        card.isPlayable = false;
        const drawnCard = this.deck[0];
        let secondDrawnCard;
        this.deck.shift();
        this.stack.push(drawnCard)
        let message = [`${playerName} drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} on dynamite`];
        
        if (this.players[playerName].character.name === "Lucky Duke") {
            secondDrawnCard = this.deck[0];
            message.push(`${playerName} drew ${secondDrawnCard.name} ${secondDrawnCard.digit} ${secondDrawnCard.type} on dynamite as Lucky Duke`);
            this.deck.shift();
        }

        // remove from playerName table card object
        this.players[playerName].table = this.players[playerName].table.filter(function( tableCard ) {
             return (tableCard.name !== card.name || tableCard.digit !== card.digit || tableCard.type !== card.type);
        });

        if (drawnCard.type === "spades" && (2 <= drawnCard.digit && drawnCard.digit <= 9)) {
            if ((this.players[playerName].character.name === "Lucky Duke" && (secondDrawnCard.type =! "spades" && 2 >= secondDrawnCard.digit && secondDrawnCard.digit >= 9))) {
                // LD drew second outside
                // find next alive player
                let currentPlayerId = this.playerRoundId + 1;
                if (currentPlayerId >= this.numOfPlayers) {
                    currentPlayerId = 0;
                }
                for (let i = 0; i < this.numOfPlayers; i++) {
                    const nextPlayer = Object.keys(this.players).find(key => this.players[key].id === currentPlayerId);
                    if (this.players[nextPlayer].character.health > 0) {
                        this.players[nextPlayer].table.push(card);
                        break;
                    }
                    currentPlayerId += 1;
                    // clamp player ID
                    if (currentPlayerId >= this.numOfPlayers) {
                        currentPlayerId = 0;
                    }
                }

            } else {
                // DEATH rest of the players
                message.push("Dynamite exploded!");
                for (let i = 0; i < 3; i++) {
                    message.push(...this.loseHealth(playerName));
                    if (this.players[playerName].character.health <= 0) {
                        this.setAllNotPlayable(playerName);
                        this.setAllCardsOnTableNotPlayable(playerName);
                    }
                }
            }
        } else {
            // find next alive player
            let currentPlayerId = this.playerRoundId + 1;
            if (currentPlayerId >= this.numOfPlayers) {
                currentPlayerId = 0;
            }
            for (let i = 0; i < this.numOfPlayers; i++) {
                const nextPlayer = Object.keys(this.players).find(key => this.players[key].id === currentPlayerId);
                if (this.players[nextPlayer].character.health > 0) {
                    this.players[nextPlayer].table.push(card);
                    break;
                }
                currentPlayerId += 1;
                // clamp player ID
                if (currentPlayerId >= this.numOfPlayers) {
                    currentPlayerId = 0;
                }
            }
        }
        
        if (!this.getPlayerHasDynamite(playerName) && !this.getPlayerIsInPrison(playerName)) {
            const currentPlayerName = this.getNameOfCurrentTurnPlayer();
            if (this.players[currentPlayerName].character.name === "Lucky Duke") {
                // populate create draw choice for Lucky Duke
                this.drawChoice = [];
                for (let i = 0; i < 2; i++) {
                    const card = this.deck[0];
                    this.drawChoice.push(card);
                    this.deck.shift();
                }
                return message;
            } else if (this.players[currentPlayerName].character.name === "Kit Carlson") {
                // populate create draw choice for Kit Carlson
                this.drawChoice = [];
                for (let i = 0; i < 3; i++) {
                    const card = this.deck[0];
                    this.drawChoice.push(card);
                    this.deck.shift();
                }
                return message;
            }
            // if not dynamite on table, allow use cards except Jesse Jones
            if (this.players[playerName].character.name !== "Pedro Ramirez" && this.stack.length > 0) {
                this.draw(2, playerName);
                this.setAllPlayable(playerName);
            }  
        } else {
            this.setAllNotPlayable(playerName);
        }
        return message;
    }

    usePrigione(playerName, card) {
        card.isPlayable = false;

        // place prison on stack
        this.stack.push(card)

        // draw card
        const drawnCard = this.deck[0];
        let secondDrawnCard;
        this.deck.shift();
        this.stack.push(drawnCard)
        let message = [`${playerName} drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} on prison`];
                
        if (this.players[playerName].character.name === "Lucky Duke") {
            // Lucky Duke second card
            secondDrawnCard = this.deck[0];
            this.deck.shift();
            this.stack.push(secondDrawnCard);
            message = [`${playerName} as Lucky Duke drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} and ${secondDrawnCard.name} ${secondDrawnCard.digit} ${secondDrawnCard.type} on Prigione`];
        }

        // remove from playerName table card object
        this.players[playerName].table = this.players[playerName].table.filter(function( tableCard ) {
             return (tableCard.name !== card.name || tableCard.digit !== card.digit || tableCard.type !== card.type);
        });

        if (drawnCard.type === "hearts" || (this.players[playerName].character.name === "Lucky Duke" && secondDrawnCard.type === "hearts")) {
            if (!this.getPlayerHasDynamite(playerName) && !this.getPlayerIsInPrison(playerName)) {
                const currentPlayerName = this.getNameOfCurrentTurnPlayer();
                if (this.players[currentPlayerName].character.name === "Lucky Duke") {
                    // populate create draw choice for Lucky Duke
                    this.drawChoice = [];
                    for (let i = 0; i < 2; i++) {
                        const card = this.deck[0];
                        this.drawChoice.push(card);
                        this.deck.shift();
                    }
                    return message;
                } else if (this.players[currentPlayerName].character.name === "Kit Carlson") {
                    // populate create draw choice for Kit Carlson
                    this.drawChoice = [];
                    for (let i = 0; i < 3; i++) {
                        const card = this.deck[0];
                        this.drawChoice.push(card);
                        this.deck.shift();
                    }
                    return message;
                } else if (this.players[currentPlayerName].character.name === "Jesse Jones") {
                    this.awaitDrawChoice = true;
                    return message;
                }

                // if not prigione on table, allow use cards except
                if (this.players[playerName].character.name !== "Pedro Ramirez" && this.stack.length > 0) {
                    this.draw(2, playerName);
                    this.setAllPlayable(playerName);
                    return message;
                }
            }
            return message;
        } else {
            // next player round
            this.endTurn();
            return message;
        }
        
    }

    loseHealth(playerName) {
        let message = [`${playerName} lost health`];

        this.players[playerName].character.health -= 1;
        this.players[playerName].mancatoPool = 0;


        this.setIsLosingHealth(false, playerName);
        this.setNotPlayable("Mancato!", playerName);
        if (this.players[playerName].character.name === "Calamity Janet") {
            this.setNotPlayable("Bang!", playerName);
        }
        this.setCardOnTableNotPlayable("Barilo", playerName)
        
        
        if (this.players[playerName].character.name === "Bart Cassidy" && !this.indianiActive) {
            // Bart Cassidy draws a card on hit
            // this works on all damage taken except Indiani -> could cause problems
            if (this.players[playerName].table.filter(foundCard => foundCard.name === "Dynamite").lenght === 0) {
                message.push(this.draw(1, playerName));
            } else {
                if (this.getNameOfCurrentTurnPlayer() !== playerName) {
                    message.push(this.draw(1, playerName));
                }
            }
        }
        
        if (playerName !== this.getNameOfCurrentTurnPlayer()) {
            // if not players turn, disable his Bang!
            // this is for lose life when Indiani
            this.setNotPlayable("Bang!", playerName)
        }
        
        if (this.duelActive) {
            this.duelActive = false;
            this.duelTurnIndex = 0;
            this.duelPlayers = [];
            if (this.bangCanBeUsed) {
                this.setNotPlayable("Bang!", playerName);
                this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            }
        }
        //El Gringo can draw from oponent when hit by Bang! or Gatling
        // Mancato! has also be in stack because of CJ
        if (this.players[playerName].character.name === "El Gringo" && (this.getTopStackCard().name === "Bang!" || this.getTopStackCard().name === "Mancato!" || this.getTopStackCard().name === "Gatling")) {
            const playerHandLenght = this.players[this.getNameOfCurrentTurnPlayer()].hand.length;
            if (playerHandLenght > 0) {
                
                const randomCardIndex = Math.floor(Math.random() * playerHandLenght);
                const randomCard = this.players[this.getNameOfCurrentTurnPlayer()].hand.shift(randomCardIndex, 1);
                randomCard.isPlayable = false;
                this.players[playerName].hand.push(randomCard);
                message.push("El Gringo was hit, so he draws 1 card");
            }
        }

        this.setAllPlayable(this.getNameOfCurrentTurnPlayer());

        if (!this.gatlingActive && !this.indianiActive) {
            // if no gatling, continue
        } else {
            // on gatling, activate playerPlaceholder only when all reactions
            // if there is player losing health, return
            // if no player is found, set playable for playerPlaceholder
            let someoneLosingHealth = false;
            for (const player of this.getPlayersLosingHealth()) {
                if (player.isLosingHealth) someoneLosingHealth = true;
            }
            if (!someoneLosingHealth) {
                this.gatlingActive = false;
                this.indianiActive = false;
    
            }
        }
        
        // 0 health -> lose game
        if (this.players[playerName].character.health <= 0) {
            // if player were to die, allow him to play beer
            for (const card of this.players[playerName].hand) {
                if (card.name === "Beer") {
                    this.useBeer(playerName, card.digit, card.type);

                    this.setAllPlayable(this.getNameOfCurrentTurnPlayer());

                    message.push(`${playerName} had Beer, so he used it`)
                    return message;
                }
            }
            // LOSE GAME
            this.setAllNotPlayable(playerName);
            this.setAllCardsOnTableNotPlayable(playerName);

            for (const player of Object.keys(this.players)) {
                if (this.players[player].character.name === "Vulture Sam" && this.players[player].character.health > 0 && player !== playerName) {
                    // if there is Vulture Sam, put dead player's hand to his hand
                    message.push(`Vulture Sam received the hand of ${playerName}`);
                    for (const card of this.players[playerName].hand) {
                        if (player === this.getNameOfCurrentTurnPlayer()) {
                            // inside VS turn
                            if (!this.bangCanBeUsed && card.name === "Bang!") {
                                // players turn and can use Bang!
                                card.isPlayable = false;
                            } else if (card.name === "Mancato!") {
                                card.isPlayable = false;
                            } else if (card.name === "Beer" && this.players[player].character.health === this.players[player].character.maxHealth) {
                                card.isPlayable = false;
                            } else {
                                card.isPlayable = true;
                            }
                        } else {
                            // outside VS turn
                            card.isPlayable = false;
                        }
                        this.players[player].hand.push(card);
                    }
                    this.players[playerName].hand = [];
                    break;
                }
            }

            if (playerName === this.getNameOfCurrentTurnPlayer()) {
                // if is current players' turn and he dies, end his turn
                message.push(...this.endTurn());
            }

            if (this.players[this.getNameOfCurrentTurnPlayer()].character.role === "Sheriff" && this.players[playerName].character.role === "Vice") {
                // Sheriff killed Vice, discard his hand
                for (let i = 0; i < this.players[this.getNameOfCurrentTurnPlayer()].hand.length; i++) {
                    const card = this.players[this.getNameOfCurrentTurnPlayer()].hand[i]

                    this.discard(card.name, card.digit, card.type, this.getNameOfCurrentTurnPlayer());
                }
                this.players[this.getNameOfCurrentTurnPlayer()].hand = [];
                message.push("Sheriff killed Vice!");
            }

            // Bandit death, draw 3
            // also outside player turn, so would not activate on Dynamite
            if (this.players[playerName].character.role === "Bandit" && playerName !== this.getNameOfCurrentTurnPlayer()) {
                this.draw(3, this.getNameOfCurrentTurnPlayer());
                this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            }

            this.knownRoles[playerName] = this.players[playerName].character.role;
            
            message.push(`${playerName} has died!`);

            if (!this.gameEnded) {
                // if not game ended, check for winner
                // ********* GAME END *********
                let aliveRoles = [];
                let deadRoles = [];
                for (const player of Object.keys(this.players)) {
                    if (this.players[player].character.health > 0) {
                        aliveRoles.push(this.players[player].character.role);
                    } else {
                        deadRoles.push(this.players[player].character.role);
                    }
                }
    
                if (aliveRoles.includes("Sheriff") && (!aliveRoles.includes("Bandit") && !aliveRoles.includes("Renegade"))){
                    // SHERIFF AND VICE WIN
                    if (aliveRoles.includes("Vice") || deadRoles.includes("Vice")) {
                        // Vice in game
                        message.push(`Sheriff (${this.getNameOfPlayersByRole("Sheriff")[0]}) and Vice (${this.getNameOfPlayersByRole("Vice")[0]}) wictory!`);
                        message.push("Game ended");
                        this.endGame();
                    } else {
                        // Vice not in game
                        message.push(`Sheriff (${this.getNameOfPlayersByRole("Sheriff")[0]}) wictory!`);
                        message.push("Game ended");
                        this.endGame();
                    }
                    
                } else if (aliveRoles.includes("Bandit") && deadRoles.includes("Sheriff")) {
                    // BANDITS WIN
                    const bandits = this.getNameOfPlayersByRole("Bandit")
                    if (bandits.length === 1) {
                        message.push(`Bandit (${bandits[0]}) wictory!`);
                        message.push("Game ended");
                        
                    } else if (bandits.length === 2) {
                        message.push(`Bandits (${bandits[0]}, ${bandits[1]}) wictory!`);
                        message.push("Game ended");
                        
                    } else if (bandits.length === 3) {
                        message.push(`Bandits (${bandits[0]}, ${bandits[1]}, ${bandits[2]}) wictory!`);
                        message.push("Game ended");
                    }
    
                    this.endGame();
                    
                } else if (aliveRoles.includes("Renegade") && (!aliveRoles.includes("Sheriff") && !aliveRoles.includes("Vice") && !aliveRoles.includes("Bandit"))) {
                    // RENEGADE WIN
                    message.push(`Renegade (${this.getNameOfPlayersByRole("Renegade")[0]}) wictory!`);
                    message.push("Game ended");
                    this.endGame();
    
                } else if (this.numOfPlayers === 2) {
                    // 1v1 WIN
                    message.push(`${this.getNameOfCurrentTurnPlayer()} is winner!`);
                    message.push("Game ended");
                    this.endGame();
                }
            }

        }

        return message;
    }

    jesseJonesTarget(target, playerName = this.getNameOfCurrentTurnPlayer()) {
        
        // if targer is player, steal random card from his hand
        // get random card from target hand
        const randomCard = this.getPlayerHand(target)[Math.floor(Math.random()*this.getPlayerHand(target).length)];
        if (!randomCard) return;
        
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
        
        // continue with turn
        this.draw(1, playerName);
        this.setAllPlayable(playerName);
        
        this.awaitDrawChoice = false;
        return `${playerName} stole 1 card from ${target} because he's Jesse Jones`;
    }

    jourdonnaisBarel(playerName){
        const drawnCard = this.deck[0];
        this.deck.shift();
        this.stack.push(drawnCard)

        const playerPlaceholder = this.getNameOfCurrentTurnPlayer();

        if (drawnCard.type === "hearts") {

            this.players[playerName].mancatoPool -= 1;

            if (this.players[playerName].mancatoPool === 0) {
                this.setIsLosingHealth(false, playerName);
                this.setAllNotPlayable(playerName);
                this.setAllPlayable(playerPlaceholder);
            }

        }

        return [`${playerName} drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} on Jourdonnais`];
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

        this.setMancatoBeerNotPlayable(playerName);

        if (this.bangCanBeUsed) {
            if (this.players[playerName].character.name === "Calamity Janet") {
                // allow Mancato! for CJ
                this.setPlayable("Mancato!", playerName)
            }
        } else {
            this.setNotPlayable("Bang!", playerName);
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
        if (this.players[playerName].character.health >= this.players[playerName].character.maxHealth) {
            this.setNotPlayable("Beer", playerName) // let player play beer if not max HP
        }
        this.setNotPlayable("Mancato!", playerName) // let player play beer if not max HP
        
        if (this.players[playerName].character.name === "Calamity Janet" && this.players[playerName].table.filter(item => item.name === 'Vulcanic').length > 0) {
            this.setPlayable("Mancato!", playerName);
        }
    }

    setCharacter(playerName, characterName) {
        // sets player character and resolves his health and starting hand size
        this.players[playerName].character.name = characterName;

        let startingHealth = 4;
        if (characterName === "El Gringo") startingHealth = 3;
        if (characterName === "Paul Regret") startingHealth = 3;

        this.players[playerName].character.maxHealth = startingHealth;
        this.players[playerName].character.health = startingHealth;
        this.players[playerName].character.startingHandSize = startingHealth;
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

    getCharacters() {
        // returns array [{name, character}]
        let state = [];
        for (var player of Object.keys(this.players)) {
            state.push({
                name: player,
                character: this.players[player].character.name,
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
        // TODO: this does not have tu run every turn?
        // return array [{name, hasDynamite}]
        // if is players current turn and has dynamite in table, set hasDynamite = true
        let state = [];
        for (var player of Object.keys(this.players)) {
            // if player is on turn and has dynamite on table
            let dynamiteFound = false;
            let prisonFound = false;
            let actionRequired = false;
            if (player === this.getNameOfCurrentTurnPlayer()) {
                if (this.getPlayerHasDynamite(player)) {
                    dynamiteFound = true
                } 
                if (this.getPlayerIsInPrison(player)) {
                    prisonFound = true;
                }
                if (this.players[player].character.name === "Jesse Jones" && this.awaitDrawChoice) {
                    actionRequired = true;
                }
                if (this.players[player].character.name === "Pedro Ramirez" && this.stack.length > 0 && this.awaitDrawChoice) {
                    actionRequired = true;
                }
            }
            state.push({
                name: player,
                hasDynamite: dynamiteFound,
                isInPrison: prisonFound,
                actionRequired: actionRequired
            })
        }
        return state;
    }

    getPlayersInRange(playerName, range) {
        // returns array of alive players closer than range to playerName
        // return array of all players if range === "max"
        
        const playerNames = Object.keys(this.players)   // array of player names;
        for (const player of playerNames) {
            if (this.players[player].character.health <= 0) {
                playerNames.splice(playerNames.indexOf(player), 1);
            }
        }

        if  (range === "max" || range === "max_not_sheriff") {
            // ******** MAX RANGE ********
            let result = [];
            for (const player of playerNames) {
                if (this.players[player].character.health > 0 && player !== playerName) {
                    // if player is alive
    
                    if (range === "max") {
                        result.push(player);
    
                    } else if (range === "max_not_sheriff") {
                        if (this.players[player].character.role !== "Sheriff") {
                            result.push(player);
                        }
    
                    }
                }
            }
            return result;


        } else if (range === "one_not_gun") {
            // ******** Panico range ********
            let result = [];

            range = 1;

            if (this.players[playerName].character.name === 'Rose Doolan') {
                // Rose Doolan works as Apaloosa
                range += 1;
            }
            // if player has Apaloosa, increase range by 1
            if (this.players[playerName].table.some(card => card.name === 'Apaloosa')) range += 1;
            
            const playerIndex = playerNames.indexOf(playerName) + playerNames.length;
            const concatArray = playerNames.concat(playerNames.concat(playerNames));    // = [...arr, ...arr, ...arr]
            
            for (let i = 0; i < concatArray.length; i++) {
                let currentName = concatArray[i];
                
                if (currentName !== playerName && this.players[currentName].character.health > 0) {
                    let currentRange = range;
                    if (this.players[currentName].table.some(card => card.name === 'Mustang')) currentRange -= 1;
                    if (this.players[currentName].character.name === "Paul Regret") currentRange -= 1;
                    
                    if (Math.abs(i - playerIndex) <= currentRange) {
                        result.push(currentName);
                    }
                };
                    
            }
                
            return result;
        } else {
            // ******** CUSTOM RANGE ********
            let result = [];
    
            if (this.players[playerName].character.name === 'Rose Doolan') {
                // Rose Doolan works as Apaloosa
                range += 1;
            }
            
            // if player has Apaloosa, increase range by 1
            if (this.players[playerName].table.some(card => card.name === 'Apaloosa')) range += 1;
            // if player has Schofield, increase range by 1
            if (this.players[playerName].table.some(card => card.name === 'Schofield')) range += 1;
            // if player has Remington, increase range by 2
            if (this.players[playerName].table.some(card => card.name === 'Remington')) range += 2;
            // if player has Rev. Carabine, increase range by 3
            if (this.players[playerName].table.some(card => card.name === 'Rev. Carabine')) range += 3;
            // if player has Winchester, increase range by 4
            if (this.players[playerName].table.some(card => card.name === 'Winchester')) range += 4;
    
            const playerIndex = playerNames.indexOf(playerName) + playerNames.length;
            const concatArray = playerNames.concat(playerNames.concat(playerNames));    // = [...arr, ...arr, ...arr]
    
            for (let i = 0; i < concatArray.length; i++) {
                const currentName = concatArray[i];

                if (currentName !== playerName && this.players[currentName].character.health > 0) {
                    let currentRange = range;
                    if (this.players[currentName].table.some(card => card.name === 'Mustang')) currentRange -= 1;
                    if (this.players[currentName].character.name === "Paul Regret") currentRange -= 1;

                    if (Math.abs(i - playerIndex) <= currentRange) {
                        result.push(currentName);
                    }
                };
            }
            return result;
        }
    }

    getPlayerHand(playerName) {
        return (this.players[playerName].hand);
    }

    getHands() {
        for (var player of Object.keys(this.players)) {
        }
    }

    getPlayerHasDynamite(playerName) {
        return (this.players[playerName].table.some(card => card.name === 'Dynamite'));
    }

    getPlayerIsInPrison(playerName) {
        return (this.players[playerName].table.some(card => card.name === 'Prigione'));
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

    getNameOfPreviousTurnPlayer () {
        // returns name of player who was on turn before this turn
        let prevId = this.playerRoundId - 1;
        if (prevId < 0) {
            prevId = this.numOfPlayers;
        }
        return Object.keys(this.players).find(key => this.players[key].id === prevId)
    }

    getAllPlayersChoseCharacter() {
        // returns true if all players have character
        // else return false
        for (const player of Object.keys(this.players)) {
            if (this.players[player].character.name === null) {
                return false;
            }
        }
        return true;
    }

    getNameOfPlayersByRole(role) {
        // return array of playerNames who have specified role
        // except for bandits array length should be 1
        let names = [];
        for (const player of Object.keys(this.players)) {
            if (this.players[player].character.role === role) {
                names.push(player);
            }
        }
        return names;
    }

    // ******************* GAME FLOW *******************
    putStackIntoDeck() {
        this.deck = this.stack;
        this.stack = [this.deck[this.deck.length - 1]]
     
        this.shuffleDeck();
    }

    setIsLosingHealth(bool, player) {
        this.players[player].isLosingHealth = bool;
    }

    startGame() {
        // each player draws startingHandSize cards
        this.shuffleDeck();
        for (var player of Object.keys(this.players)) {
            this.draw(this.players[player].character.startingHandSize, player);
        }

        let firstPlayerName;
        if (this.numOfPlayers >= 4) {
            firstPlayerName = Object.keys(this.players).find(player => this.players[player].character.role === "Sheriff");
        } else {
            firstPlayerName = Object.keys(this.players).find(player => this.players[player].id === 0);
        }

        this.playerRoundId = this.players[firstPlayerName].id;

        if (this.players[firstPlayerName].character.name === "Lucky Duke") {
            // populate create draw choice for Kit Carlson
            this.drawChoice = [];
            for (let i = 0; i < 2; i++) {
                const card = this.deck[0];
                this.drawChoice.push(card);
                this.deck.shift();
            }
            
        } else if (this.players[firstPlayerName].character.name === "Jesse Jones") {
            this.awaitDrawChoice = true;

        } else if (this.players[firstPlayerName].character.name === "Kit Carlson") {
            // populate create draw choice for Kit Carlson
            this.drawChoice = [];
            for (let i = 0; i < 3; i++) {
                const card = this.deck[0];
                this.drawChoice.push(card);
                this.deck.shift();
            }
        
        } else {
            this.draw(2, firstPlayerName);
            this.setAllPlayable(firstPlayerName);
        }

        return ["Game started!"];
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

    endTurn() {
        //find who was previous player
        let message = [];
        const previousPlayerName = this.getNameOfCurrentTurnPlayer()
        
        if (this.players[previousPlayerName].character.name === "Suzy Lafayette" && this.players[previousPlayerName].hand.length === 0) {
            // Suzy Lafayette draws a card on turn end if hand empty
            message.push("Suzy Lafayette has hand empty, so she draws 1 card");
            this.draw(1, previousPlayerName);
        }

        // find next playerRoundId
        for (let i = 0; i < this.numOfPlayers; i++) {
            // move playerRoundId forward
            this.playerRoundId += 1;
            if (this.playerRoundId >= this.numOfPlayers) {
                this.playerRoundId = 0;
            }
            if (this.players[this.getNameOfCurrentTurnPlayer()].character.health > 0) {
                // if the next player is alive, continue and set his turn
                break;
            }            
        }

        // this is next player in line
        const currentPlayerName = this.getNameOfCurrentTurnPlayer();
        this.bangCanBeUsed = true;
        
        message.push(`End of turn, next player: ${currentPlayerName}`);

        this.setAllNotPlayable(previousPlayerName);

        if (this.getPlayerHasDynamite(currentPlayerName) && this.getPlayerIsInPrison(currentPlayerName)) {
            this.setCardOnTablePlayable("Dynamite", currentPlayerName);
            
            this.players[currentPlayerName].isInPrison = true;
            this.setCardOnTablePlayable("Prigione", currentPlayerName);
            return message;
        }
        
        if (this.getPlayerHasDynamite(currentPlayerName)) {
            this.setCardOnTablePlayable("Dynamite", currentPlayerName);
            return message;
            
        } else if (this.getPlayerIsInPrison(currentPlayerName)) {
            this.players[currentPlayerName].isInPrison = true;
            this.setCardOnTablePlayable("Prigione", currentPlayerName);
            return message;
        
        } else if (this.players[currentPlayerName].character.name === "Jesse Jones") {
            this.awaitDrawChoice = true;
            
        } else if (this.players[currentPlayerName].character.name === "Pedro Ramirez" && this.stack.length > 0) {
            this.awaitDrawChoice = true;
        
        } else if (this.players[currentPlayerName].character.name === "Kit Carlson") {
            // populate create draw choice for Kit Carlson
            this.drawChoice = [];
            for (let i = 0; i < 3; i++) {
                const card = this.deck[0];
                this.drawChoice.push(card);
                this.deck.shift();
            }
        
        } else if (this.players[currentPlayerName].character.name === "Lucky Duke") {
            // populate create draw choice for Kit Carlson
            this.drawChoice = [];
            for (let i = 0; i < 2; i++) {
                const card = this.deck[0];
                this.drawChoice.push(card);
                this.deck.shift();
            }

        } else {
            // proceed and draw
            if (this.players[currentPlayerName].character.name === "Black Jack" && (this.deck[1].type === "hearts" || this.deck[1].type === "diamonds")){
                // Black Jack can draw 3 on hearts or diamonds
                message.push(`${currentPlayerName} is Black Jack and drew ${this.deck[1].name} ${this.deck[1].type} as a second card so he draws another card`);
                this.draw(3, currentPlayerName);
            } else {
                message.push(this.draw(2, currentPlayerName));
            }
            this.setAllPlayable(currentPlayerName);     
        }

        return message;
    }

    removePlayer(playerName) {
        if (playerName === this.getNameOfCurrentTurnPlayer() && Object.keys(this.players).length > 1) {
            // if player turn and another player in game
            // next turn
            this.endTurn()
        }
        const numberOfBeersInHand = this.players[playerName].hand.filter(item => item.name === 'Beer').length;
        this.players[playerName].character.health = 0 + numberOfBeersInHand;
        let message;
        for (let i = 0; i < numberOfBeersInHand + 1; i++) {
            message = this.loseHealth(playerName);
        }
        this.knownRoles[playerName] = this.players[playerName].character.role;
        return message;
    }

    genCharacterChoices() {
        let res = {};
        const playerNames = Object.keys(this.players);

        for (let i = 0; i < this.numOfPlayers; i++) {
            let playerChoice = []
            for (let i = 0; i < 2; i++) {
                const randIndex = Math.floor(Math.random() * this.namesOfCharacters.length);
                // add to player choice
                playerChoice.push(this.namesOfCharacters[randIndex]);
                // remove from namesOfCharacters
                this.namesOfCharacters.splice(randIndex, 1);
            }
            res[playerNames[i]] = playerChoice;
        }
        return res;
    }

    initRoles() {
        // gives a role to each player
        // if roles is Sheriff, maxHP +1

        // if less than 4 players, leave roles as null
        if (this.numOfPlayers < 4) return;

        let roles;
        if (this.numOfPlayers === 4) {
            roles = ["Sheriff", "Renegade", "Bandit", "Bandit"]
        } else if (this.numOfPlayers === 5) {
            roles = ["Sheriff", "Renegade", "Bandit", "Bandit", "Vice"]
        } else if (this.numOfPlayers === 6) {
            roles = ["Sheriff", "Renegade", "Bandit", "Bandit", "Bandit", "Vice"]
        }
        for (let player of Object.keys(this.players)) {
            // get random role, splice from roles
            const randIndex = Math.floor(Math.random() * roles.length);
            const role = roles.splice(randIndex, 1)[0];
            // add role to player
            this.players[player].character.role = role;

            // sherif +1 HP
            if (role === "Sheriff") {
                this.players[player].character.maxHealth += 1;
                this.players[player].character.health += 1;
                this.players[player].character.startingHandSize += 1;

                this.knownRoles[player] = role;
            } else {
                this.knownRoles[player] = null;
            }
        }
    }

    endGame() {
        this.gameEnded = true;
        for (const player of Object.keys(this.players)) {
            // turns off all playable cards
            this.setAllNotPlayable(player);
            for (const card of this.players[player].table) {
                this.setCardOnTableNotPlayable(card, player);
            }

            // uncover known roles
            this.knownRoles[player] = this.players[player].character.role;
        }
    }
}

module.exports = Game;