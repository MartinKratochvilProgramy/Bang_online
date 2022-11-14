loseHealth(playerName) {
    let message = [`${playerName} lost health`];

    this.players[playerName].character.health -= 1;

    this.setIsLosingHealth(false, playerName);
    this.setNotPlayable("Mancato!", playerName);
    if (this.players[playerName].character.name === "Calamity Janet") {
        this.setNotPlayable("Bang!", playerName);
    }
    this.setCardOnTableNotPlayable("Barilo", playerName)
    
    
    if (!this.indianiActive && this.players[playerName].character.name === "Bart Cassidy") {
        // Bart Cassidy draws a card on hit
        // this works on all damage taken except Indiani -> could cause problems
        message.push(this.draw(1, playerName));
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
            const currentPlayer = this.getNameOfCurrentTurnPlayer();
            this.setNotPlayable("Bang!", playerName);
            this.setAllPlayable(currentPlayer);
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

    if (!this.gatlingActive && !this.indianiActive) {
        // if no gatling, continue
        this.setAllPlayable(this.playerPlaceHolder);
        if (!this.bangCanBeUsed) {
            this.setNotPlayable("Bang!", this.playerPlaceHolder);
            if (this.players[this.playerPlaceHolder].character.name === "Calamity Janet") {
                // also disable Mancato! for CJ
                this.setNotPlayable("Mancato!", this.playerPlaceHolder);
            }
        }
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

            this.setAllPlayable(this.playerPlaceHolder);
            if (!this.bangCanBeUsed) {
                this.setNotPlayable("Bang!", this.playerPlaceHolder);
                if (this.players[this.playerPlaceHolder].character.name === "Calamity Janet") {
                    // also disable Mancato! for CJ
                    this.setNotPlayable("Mancato!", this.playerPlaceHolder);
                }
            }
        }
    }
    
    // 0 health -> lose game
    if (this.players[playerName].character.health <= 0) {
        // if player were to die, allow him to play beer
        for (const card of this.players[playerName].hand) {
            if (card.name === "Beer") {
                this.useBeer(playerName, card.digit, card.type);

                this.setAllPlayable(this.playerPlaceHolder);
                if (!this.bangCanBeUsed) {
                    this.setNotPlayable("Bang!", this.playerPlaceHolder);
                    if (this.players[this.playerPlaceHolder].character.name === "Calamity Janet") {
                        // also disable Mancato! for CJ
                        this.setNotPlayable("Mancato!", this.playerPlaceHolder);
                    }
                }
                return message;
            }
        }
        // LOSE GAME
        this.setAllNotPlayable(playerName);
        this.setAllCardsOnTableNotPlayable(playerName);

        for (const player of Object.keys(this.players)) {
            if (this.players[player].character.name === "Vulture Sam" && player !== playerName) {
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
            }
            break;
        }

        if (playerName === this.getNameOfCurrentTurnPlayer()) {
            // if is current players' turn and he dies, end his turn
            message.push(this.endTurn());
        }

        if (this.players[this.playerPlaceHolder].character.role === "Sheriff" && this.players[playerName].character.role === "Vice") {
            // Sheriff killed Vice, discard his hand
            for (let i = 0; i < this.players[this.playerPlaceHolder].hand.length; i++) {
                const card = this.players[this.playerPlaceHolder].hand[i]

                this.discard(card.name, card.digit, card.type, this.playerPlaceHolder);
            }
            this.players[this.playerPlaceHolder].hand = [];
            message.push("Sheriff killed Vice!");
        }

        this.knownRoles[playerName] = this.players[playerName].character.role;
        
        message.push(`${playerName} has died!`);

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
            
        } else if (aliveRoles.includes("Renegade") && (!aliveRoles.includes("Sheriff") && !aliveRoles.includes("Vice") && !aliveRoles.includes("Renegade"))) {
            // RENEGADE WIN
            message.push(`Renegade (${this.getNameOfPlayersByRole("Renegade")[0]}) wictory!`);
            message.push("Game ended");
            this.endGame();

        } else if (this.numOfPlayers === 2) {
            // 1v1 WIN
            message.push(`${this.playerPlaceHolder} is winner!`);
            message.push("Game ended");
            this.endGame();
        }
    }

    return message;
}