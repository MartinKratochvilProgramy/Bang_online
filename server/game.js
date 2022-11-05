class Game {
    constructor(playerNames, deck) {
        this.numOfPlayers = playerNames.length;
        const namesOfCharacters = ["Lucky Duke", "Kit Carlson", "Sid Ketchum", "Sid Ketchum"] // TODO: remove
        this.deck = deck;
        this.stack = [];
        this.emporio = [];
        this.drawChoice = [];
        this.players = {}
        this.playerRoundId = 0;
        this.bangCanBeUsed = true;
        this.duelActive = false;
        this.indianiActive = false;
        this.gatlingActive = false;
        this.duelPlayers = null;
        this.duelTurnIndex = 0;
        this.playerPlaceHolder = null;
        this.luckyDukeFirstDraw = true;
        this.sidKetchumDiscarded = false;
        this.awaitJesseJones = false;

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
                        this.name = namesOfCharacters[i],
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

    drawFromDeck(numToDraw, playerName = this.getNameOfCurrentTurnPlayer()) {
        // put nomToDraw cards into hand of current playerRoundId
        // remove top card from deck
        
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

        this.setAllPlayable(playerName);
        this.setMancatoBeerNotPlayable(playerName);

        if (this.players[playerName].character.name === "Jesse Jones") {
            this.awaitJesseJones = false;
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
        console.log(`Player ${playerName} used Bang! on ${target}`);
        
        this.setPlayable("Mancato!", target);
        
        if (this.players[playerName].character.name === "Slab the Killer" && this.players[target].hand.filter(card => card.name === "Mancato!").length < 2) {
            // target needs 2 Mancato! for Slab the Killer
            this.setNotPlayable("Mancato!", target);
        }
        
        if (this.players[playerName].character.name === "Slab the Killer" && this.players[target].hand.filter(card => card.name === "Mancato!").length >= 1 && this.players[target].table.filter(card => card.name === "Barilo").length >= 1) {
            // target has more than 1 Mancato! and Barilo
            this.setNotPlayable("Mancato!", target);
        }

        if (this.players[target].canUseBarel) {
            this.setCardOnTablePlayable("Barilo", target);
        }
        
        if (this.players[playerName].character.name === "Slab the Killer" && this.players[target].character.name === "Calamity Janet") {
            if (this.players[target].hand.filter(card => (card.name === "Mancato!" || card.name === "Bang!")).length >= 2) {
                this.setPlayable("Bang!", target);
                this.setPlayable("Mancato!", target);
            } else if (this.players[target].hand.filter(card => (card.name === "Mancato!" || card.name === "Bang!")).length ===1 && this.players[target].table.filter(card => (card.name === "Barilo")).length >= 1) {
                this.setPlayable("Bang!", target);
                this.setPlayable("Mancato!", target);

            } else {
                this.setNotPlayable("Mancato!", target);
                this.setNotPlayable("Bang!", target);
                this.setCardOnTableNotPlayable("Barilo", target)
            }
        }

        this.setAllNotPlayable(playerName);
        if (this.players[playerName].table.filter(item => item.name === 'Vulcanic').length > 0 || this.players[playerName].character.name === "Willy the Kid") {
            // if player has Volcanic or is Willy the Kid don't block Bang!s
            // TODO: implement this for Billy the Kid
            this.bangCanBeUsed = true;
        } else {
            this.bangCanBeUsed = false;
        }

        this.playerPlaceHolder = playerName;    // save the name of player who used Bang!, so that his hand could be enabled after target player reaction
        
        this.setIsLosingHealth(true, target);
    }
    
    useBangAsCJ(playerName, cardDigit, cardType) {
        if (this.players[this.getNameOfCurrentTurnPlayer()].character.name === "Slab the Killer") {
            if (!this.gatlingActive) {
                // Calamity Janet discard 2 Mancato! or Bang!
                for (let i = 0; i < 2; i++) {
                    const index = this.players[playerName].hand.findIndex(card => {
                        return (card.name === 'Mancato!' || card.name === "Bang!");
                    });
                    const card = this.players[playerName].hand[index];
                    this.discard(card.name, card.digit, card.type, playerName);
                    console.log(`Player ${playerName} discarded 2 ${card.name} on Slab the Killer`);
                }
            } else {
                this.discard("Bang!", cardDigit, cardType, playerName);
                this.gatlingActive = false;
            }
        } else {
            // normally discard 1 card
            this.discard("Bang!", cardDigit, cardType, playerName);
            console.log(`Player ${playerName} used Bang! as Mancato!`);
        }

        this.players[playerName].canUseBarel = true;

        this.setCardOnTableNotPlayable("Barilo", playerName);
        this.setNotPlayable("Bang!", playerName);
        this.setNotPlayable("Mancato!", playerName);
        
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
        if (!this.gatlingActive) {
            if (this.players[this.getNameOfCurrentTurnPlayer()].character.name === "Slab the Killer") {
                if (this.players[playerName].character.name === "Calamity Janet") {
    
                    // Calamity Janet discard 2 Mancato! or Bang!
                    for (let i = 0; i < 2; i++) {
                        const index = this.players[playerName].hand.findIndex(card => {
                            return (card.name === 'Mancato!' || card.name === "Bang!");
                        });
                        const card = this.players[playerName].hand[index];
                        this.discard(card.name, card.digit, card.type, playerName);
                        console.log(`Player ${playerName} discarded 2 ${card.name} on Slab the Killer`);
                    }
                } else {
                    // on Slab the Killer, discard two Mancato!
                    for (let i = 0; i < 2; i++) {
                        const index = this.players[playerName].hand.findIndex(card => {
                            return (card.name === 'Mancato!');
                        });
                        const card = this.players[playerName].hand[index];
                        this.discard(card.name, card.digit, card.type, playerName);
                    }
                      console.log(`Player ${playerName} discarded 2 Mancato! on Slab the Killer`);
                }
            } else {
                // normally discard one Mancato!
                this.discard("Mancato!", cardDigit, cardType, playerName);
                console.log(`Player ${playerName} used Mancato!`);
            }
        } else {
            // normally discard one Mancato!
            this.discard("Mancato!", cardDigit, cardType, playerName);
            console.log(`Player ${playerName} used Mancato!`);
        }

        this.players[playerName].canUseBarel = true;

        this.setMancatoBeerNotPlayable(playerName);
        this.setCardOnTableNotPlayable("Barilo", playerName);
        
        this.setIsLosingHealth(false, playerName);
        
        if (this.indianiActive) {
            // CJ can play Mancato! on Indiani, so disable all cards if this happens
            this.setAllNotPlayable(playerName);
        }
        
        // if there is player loosing health, return
        // if no player is found, set playable for playerPlaceholder
        for (const player of this.getPlayersLosingHealth()) {
            if (player.isLosingHealth) return;
        }
        this.gatlingActive = false;
        this.setAllPlayable(this.playerPlaceHolder);
        this.setMancatoBeerNotPlayable(this.playerPlaceHolder);
        
        if (!this.bangCanBeUsed) {
            this.setNotPlayable("Bang!", this.playerPlaceHolder);
            if (this.players[this.playerPlaceHolder].character.name === "Calamity Janet") {
                // also disable Mancato! for CJ
                this.setNotPlayable("Mancato!", this.playerPlaceHolder);
            }
        }
    }

    useMancatoInDuel(cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        // special case of Bang! use, sets the next turn of the duel state

        this.discard("Mancato!", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Mancato! as Bang! in duel`);

        this.setNotPlayable("Bang!", this.duelPlayers[this.duelTurnIndex]);
        this.setNotPlayable("Mancato!", this.duelPlayers[this.duelTurnIndex]);
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

    useMancatoAsCJ(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Mancato!", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} discarded Mancato! as Bang! on ${target}`);

        this.setPlayable("Mancato!", target);
        if (this.players[target].canUseBarel) {
            this.setCardOnTablePlayable("Barilo", target);
        }

        this.setAllNotPlayable(playerName);
        if (this.players[playerName].table.filter(item => item.name === 'Vulcanic').length > 0 || this.players[playerName].character.name === "Willy the Kid") {
            // if player has Volcanic or is Willy the Kid don't block Bang!s
            // TODO: implement this for Billy the Kid
            this.bangCanBeUsed = true;
        } else {
            this.bangCanBeUsed = false;
        }

        this.playerPlaceHolder = playerName;    // save the name of player who used Bang!, so that his hand could be enabled after target player reaction
        
        this.setIsLosingHealth(true, target);

    }

    useCatBallou(target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        // TODO: this only works on cards in hand, not table
        this.discard("Cat Balou", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Cat Balou`);

        // get random card from target hand
        const randomCard = this.getPlayerHand(target)[Math.floor(Math.random()*this.getPlayerHand(target).length)]

        this.discard(randomCard.name, randomCard.digit, randomCard.type, target);
        console.log(`Player ${target} discarded ${randomCard.name}`);
    }

    useCatBallouOnTableCard(activeCard, target, cardDigit, cardType, playerName = this.getNameOfCurrentTurnPlayer()) {
        this.discard("Cat Balou", activeCard.digit, activeCard.type, playerName);
        console.log(`Player ${playerName} used Cat Balou`);
        
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
            if (this.players[player].character.health > 0 && this.players[player].character.health < this.players[player].character.maxHealth) {
                this.players[player].character.health += 1;
            }
        }
    }

    useEmporio(playerName = this.getNameOfCurrentTurnPlayer(), cardDigit, cardType) {
        this.discard("Emporio", cardDigit, cardType, playerName);
        console.log(`Player ${playerName} used Emporio`);

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
            // end when no cards to draw
            this.setAllPlayable(this.playerPlaceHolder);
            this.setMancatoBeerNotPlayable(this.playerPlaceHolder);
            this.emporio = [];
            this.nextEmporioTurn = "";
            return;
        }
        const playerNames = Object.keys(this.players);
        let currentEmporioTurnPlayerIndex = playerNames.findIndex(player => player === this.nextEmporioTurn)
            // find next alive player
            for (let i = 0; i < this.numOfPlayers; i++) {
                currentEmporioTurnPlayerIndex += 1;
                const nextPlayer = Object.keys(this.players).find(key => this.players[key].id === currentEmporioTurnPlayerIndex);
                if (this.players[nextPlayer].character.health > 0) {
                    this.players[nextPlayer].table.push(card);
                    break;
                }
                // clamp player ID
                if (currentEmporioTurnPlayerIndex >= this.numOfPlayers) {
                    currentEmporioTurnPlayerIndex = 0;
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
            this.setMancatoBeerNotPlayable(playerName);
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
            this.setMancatoBeerNotPlayable(playerName);
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
        this.setMancatoBeerNotPlayable(playerName);
        
        console.log("Pedro Ramirez drew first crad from stack");
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

        if (this.players[playerName].character.name === "Slab the Killer") {
            this.gatlingActive = true;
        }

        for (const target of Object.keys(this.players)) {
            // put hit on all players, except playerName and dead players
            if (target !== playerName && this.players[target].character.health > 0) {
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
            if (target !== playerName && this.players[target].character.health > 0) {
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
        const cardIndex = this.players[playerName].hand.findIndex(foundCard => (foundCard.name === card.name && foundCard.digit === card.digit && foundCard.type === card.type));
        this.players[playerName].hand.splice(cardIndex, 1)[0];
        console.log(`Player ${playerName} put ${target} in prison`);

        card.isPlayable = false;
        this.players[target].table.push(card);
    }

    useBarel(playerName) {
        const drawnCard = this.deck[0];
        this.deck.shift();
        this.stack.push(drawnCard);
        
        if (this.players[playerName].character.name === "Lucky Duke") {
            // Lucky Duke second card
            const secondDrawnCard = this.deck[0];
            this.deck.shift();
            this.stack.push(secondDrawnCard);
            console.log(`Player ${playerName} as Lucky Duke drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} and ${secondDrawnCard.name} ${secondDrawnCard.digit} ${secondDrawnCard.type} on Barel`);
        } else {
            console.log(`Player ${playerName} drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} on barel`);
        }

        this.players[playerName].canUseBarel = false;
        this.setCardOnTableNotPlayable("Barilo", playerName);
        if (this.players[playerName].character.name === "Calamity Janet") {
            this.setNotPlayable("Bang!", playerName)
        }

        if (drawnCard.type === "hearts" || (this.players[playerName].character.name === "Lucky Duke" && secondDrawnCard.type === "hearts")) {
            if (this.players[this.getNameOfCurrentTurnPlayer()].character.name === "Slab the Killer") {
                // attacked by Slab the Killer
                // discard Mancato!
                const index = this.players[playerName].hand.findIndex(card => {
                    return (card.name === 'Mancato!');
                });
                if (index >= 0) {
                    // Mancato! found in hand
                    const card = this.players[playerName].hand[index];
                    this.discard(card.name, card.digit, card.type, playerName);
                } else {
                    // if no Mancato! found (playerName is CJ) -> discard Bang! instead
                    const bangIndex = this.players[playerName].hand.findIndex(card => {
                        return (card.name === 'Bang!');
                    });
                    const cardBang = this.players[playerName].hand[bangIndex];
                    this.discard(cardBang.name, cardBang.digit, cardBang.type, playerName);
                }
            } 
          
            this.setIsLosingHealth(false, playerName);
            this.setNotPlayable("Mancato!", playerName);

            this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            this.setMancatoBeerNotPlayable(this.getNameOfCurrentTurnPlayer());
            if (!this.bangCanBeUsed) {
                this.setNotPlayable("Bang!", this.getNameOfCurrentTurnPlayer())
                if (this.players[this.getNameOfCurrentTurnPlayer()].character.name === "Calamity Janet") {
                    // laso disallow Mancato! for CJ
                    this.setNotPlayable("Mancato!", this.getNameOfCurrentTurnPlayer())
                }
            }
        }

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
            if (this.players[playerName].character.health <= 3) {
              // player DIED
                this.setAllNotPlayable(playerName);
                this.setAllCardsOnTableNotPlayable(playerName);
                // endTurn() is handled in the server
                console.log(`Player ${playerName} has died!`)  
                return;
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
                return;
            } else if (this.players[currentPlayerName].character.name === "Kit Carlson") {
                // populate create draw choice for Kit Carlson
                this.drawChoice = [];
                for (let i = 0; i < 3; i++) {
                    const card = this.deck[0];
                    this.drawChoice.push(card);
                    this.deck.shift();
                }
                return;
            }
            // if not dynamite on table, allow use cards except Jesse Jones
            if (this.players[playerName].character.name !== "Jesse Jones") {
                this.setAllPlayable(playerName);
                this.setMancatoBeerNotPlayable(playerName);
                this.draw(2, playerName);
            }
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
                
        if (this.players[playerName].character.name === "Lucky Duke") {
            // Lucky Duke second card
            const secondDrawnCard = this.deck[0];
            this.deck.shift();
            this.stack.push(secondDrawnCard);
            console.log(`Player ${playerName} as Lucky Duke drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} and ${secondDrawnCard.name} ${secondDrawnCard.digit} ${secondDrawnCard.type} on Prigione`);
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
                    return;
                } else if (this.players[currentPlayerName].character.name === "Kit Carlson") {
                    // populate create draw choice for Kit Carlson
                    this.drawChoice = [];
                    for (let i = 0; i < 3; i++) {
                        const card = this.deck[0];
                        this.drawChoice.push(card);
                        this.deck.shift();
                    }
                    return;
                } else if (this.players[currentPlayerName].character.name === "Jesse Jones") {
                    this.awaitJesseJones = true;
                }
                // if not dynamite on table, allow use cards except Jesse Jones
                if (this.players[playerName].character.name !== "Jesse Jones") {
                    this.draw(2, playerName);
                    this.setAllPlayable(playerName);
                    this.setMancatoBeerNotPlayable(playerName);
                }            
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
        this.setNotPlayable("Mancato!", playerName);
        if (this.players[playerName].character.name === "Calamity Janet") {
            this.setNotPlayable("Bang!", playerName);
        }
        this.setCardOnTableNotPlayable("Barilo", playerName)
        
        this.setAllPlayable(this.playerPlaceHolder);
        this.setMancatoBeerNotPlayable(this.playerPlaceHolder);

        if (!this.bangCanBeUsed) {
            this.setNotPlayable("Bang!", this.playerPlaceHolder);
            if (this.players[this.playerPlaceHolder].character.name === "Calamity Janet") {
                // also disable Mancato! for CJ
                this.setNotPlayable("Mancato!", this.playerPlaceHolder);
            }
        }

        if (!this.indianiActive && this.players[playerName].character.name === "Bart Cassidy") {
            // Bart Cassidy draws a card on hit
            // this works on all damage taken except Indiani -> could cause problems
            this.draw(1, playerName);
        }

        if (playerName !== this.getNameOfCurrentTurnPlayer()) {
            // if not players turn, disable his Bang!
            // this is for lose life when Indiani
            this.setNotPlayable("Bang!", playerName)
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
        //El Gringo can draw when hit by Bang! or Gatling
        // Mancato! has also be in stack because of CJ
        if (this.players[playerName].character.name === "El Gringo" && (this.getTopStackCard().name === "Bang!" || this.getTopStackCard().name === "Mancato!" || this.getTopStackCard().name === "Gatling")) {
            this.draw(1, playerName);
            console.log("El Gringo was hit, so he draws 1 card");
        }

        // if player were to day, allow him to play beer
        if (this.players[playerName].character.health <= 0) {
            for (const card of this.players[playerName].hand) {
                if (card.name === "Beer") {
                    console.log("Losing: ", card.digit, card.type);
                    this.useBeer(playerName, card.digit, card.type);
                    return;
                }
            }
            // LOSE GAME
            this.setAllNotPlayable(playerName);
            this.setAllCardsOnTableNotPlayable(playerName);
            console.log(`Player ${playerName} has died!`)
            for (const player of Object.keys(this.players)) {
                if (this.players[player].character.name === "Vulture Sam") {
                    // if there is Vulture Sam, put dead player's hand to his hand
                    console.log(`Vulture Sam received the hand of ${playerName}`)
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
                }
                break;
            }
            if (playerName === this.getNameOfCurrentTurnPlayer()) {
                // if is current players' turn and he dies, end his turn
                this.endTurn();
            }
        }
    }

    jesseJonesTarget(target, playerName = this.getNameOfCurrentTurnPlayer()) {
        console.log(`Player ${playerName} stole 1 card from ${target} because he's Jesse Jones`);
        
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
        this.setMancatoBeerNotPlayable(playerName);

        this.awaitJesseJones = false;
    }

    jourdonnaisBarel(playerName){
        const drawnCard = this.deck[0];
        this.deck.shift();
        this.stack.push(drawnCard)

        if (drawnCard.type === "hearts") {
            this.setIsLosingHealth(false, playerName);
            this.setNotPlayable("Mancato!", playerName);
            this.setAllPlayable(this.getNameOfCurrentTurnPlayer());
            this.setMancatoBeerNotPlayable(this.getNameOfCurrentTurnPlayer());
            if (!this.bangCanBeUsed) {
                this.setNotPlayable("Bang!", this.getNameOfCurrentTurnPlayer())
                if (this.players[this.getNameOfCurrentTurnPlayer()].character.name === "Calamity Janet") {
                    // laso disallow Mancato! for CJ
                    this.setNotPlayable("Mancato!", this.getNameOfCurrentTurnPlayer())
                }
            }
        }

        console.log(`Player ${playerName} drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} on Jourdonnais`);
    }

    // ******************* SETERS *******************
    setPlayable(cardName, playerName) {
        // sets cardName in playerName hand to isPlayable = true
        for (var card of this.players[playerName].hand) {
            if (card.name === cardName) {
                card.isPlayable = true;
            }
        }
        if (cardName === "Bang!" && this.players[playerName].character.name === "Calamity Janet") {
            for (var card of this.players[playerName].hand) {
                if (card.name === "Mancato!") {
                    card.isPlayable = true;
                }
            }
        }
        if (cardName === "Mancato!" && this.players[playerName].character.name === "Calamity Janet") {
            for (var card of this.players[playerName].hand) {
                if (card.name === "Bang!") {
                    card.isPlayable = true;
                }
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
        if (this.players[playerName].character.health >= this.players[playerName].character.maxHealth) {
            this.setNotPlayable("Beer", playerName) // let player play beer if not max HP
        }
        if (this.players[playerName].character.name !== "Calamity Janet") {
            this.setNotPlayable("Mancato!", playerName);
        }
        if (this.players[playerName].character.name !== "Calamity Janet" && this.players[playerName].table.filter(item => item.name === 'Vulcanic').length > 0) {
            this.setPlayable("Mancato!", playerName);
        }
    }

    // ******************* GETERS *******************
    getAllPlayersInfo() {
        // returns array [{name, character numberOfCards, health, table}]
        let state = [];
        for (var player of Object.keys(this.players)) {
            state.push({
                name: player,
                character: this.players[player].character.name, // TODO: this could be sent once at the start of game
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
                if (this.players[player].character.name === "Jesse Jones" && this.awaitJesseJones) {
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

        if (this.players[playerName].table.some(card => card.name === 'Apaloosa')) {
            // if player has Apaloosa, increase range by 1
            range += 1;
        }

        if (this.players[playerName].character.name === 'Rose Doolan') {
            // Rose Doolan works as Apaloosa
            range += 1;
        }
        if  (range === "max" || range === "max_not_sheriffo") {
            // ******** MAX RANGE ********
            let result = [];
            for (const player of playerNames) {
                if (this.players[player].character.health > 0 && player !== playerName) {
                    // if player is alive
    
                    if (range === "max") {
                        result.push(player);
    
                    } else if (range === "max_not_sheriffo") {
                        if (player !== playerName && this.players[player].character.role !== "Sheriffo") {
                            result.push(player);
                        }
    
                    }
                }
            }
            return result;
        } else if (range === "one_not_gun") {
                // ******** CUSTOM RANGE ********
                let result = [];

                const playerIndex = playerNames.indexOf(playerName) + playerNames.length;
                const concatArray = playerNames.concat(playerNames.concat(playerNames));    // = [...arr, ...arr, ...arr]

                for (let i = 0; i < concatArray.length; i++) {
                    let currentName = concatArray[i];

                    if (currentName !== playerName && this.players[currentName].character.health > 0) {
                        const currentRange = range;
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

        if (this.players[firstPlayerName].character.name === "Lucky Duke") {
            // populate create draw choice for Kit Carlson
            this.drawChoice = [];
            for (let i = 0; i < 2; i++) {
                const card = this.deck[0];
                this.drawChoice.push(card);
                this.deck.shift();
            }
            
        } else if (this.players[firstPlayerName].character.name === "Jesse Jones") {
            this.awaitJesseJones = true;

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
            this.setMancatoBeerNotPlayable(firstPlayerName)
        }

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

        if (this.players[previousPlayerName].character.name === "Suzy Lafayette" && this.players[previousPlayerName].hand.length === 0) {
            // Suzy Lafayette draws a card on turn end if hand empty
            console.log("Suzy Lafayette has hand empty, so she draws 1 card");
            this.draw(1, previousPlayerName);
        }

        for (let i = 0; i < this.numOfPlayers; i++) {
            // move playerRoundId forward
            this.playerRoundId += 1;
            // TODO: numOfPlayers changes on death
            if (this.playerRoundId >= this.numOfPlayers) {
                this.playerRoundId = 0;
            }
            if (this.players[this.getNameOfCurrentTurnPlayer()].character.health > 0) {
                // if the next player is alive, continue and set his turn
                break;
            }            
        }
        const currentPlayerName = this.getNameOfCurrentTurnPlayer()

        this.setAllNotPlayable(previousPlayerName);

        if (this.getPlayerHasDynamite(currentPlayerName) && this.getPlayerIsInPrison(currentPlayerName)) {
            console.log("Activate dynamite: ", currentPlayerName);
            this.players[currentPlayerName].hasDynamite = true;
            this.setCardOnTablePlayable("Dynamite", currentPlayerName);
            
            console.log("Activate prison: ", currentPlayerName);
            this.players[currentPlayerName].isInPrison = true;
            this.setCardOnTablePlayable("Prigione", currentPlayerName);
            return;
        }
        
        if (this.getPlayerHasDynamite(currentPlayerName)) {
            console.log("Activate dynamite: ", currentPlayerName);
            this.players[currentPlayerName].hasDynamite = true;
            this.setCardOnTablePlayable("Dynamite", currentPlayerName);
            return;
            
        } else if (this.getPlayerIsInPrison(currentPlayerName)) {
            console.log("Activate prison: ", currentPlayerName);
            this.players[currentPlayerName].isInPrison = true;
            this.setCardOnTablePlayable("Prigione", currentPlayerName);
            return;
        
        } else if (this.players[currentPlayerName].character.name === "Jesse Jones") {
            this.awaitJesseJones = true;
        
        } else if (this.players[currentPlayerName].character.name === "Pedro Ramirez") {
            null
        
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
                console.log(`Player ${currentPlayerName} is Black Jack and drew ${this.deck[1].name} ${this.deck[1].type} as a second card so he draws another card`);
                this.draw(3, currentPlayerName);
            } else {
                this.draw(2, currentPlayerName);
            }
            this.setAllPlayable(currentPlayerName);     
            this.setMancatoBeerNotPlayable(currentPlayerName);
        }

        console.log("End of turn, next player: ", currentPlayerName);

    }

    removePlayer(playerName) {
        if (playerName === this.getNameOfCurrentTurnPlayer() && Object.keys(this.players).length > 1) {
            // if player turn and another player in game
            // next turn
            this.endTurn()
        }
        delete this.players[playerName];
    }
}

module.exports = Game;