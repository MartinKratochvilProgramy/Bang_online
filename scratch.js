useBarel(playerName) {
    const drawnCard = this.deck[0];
    this.deck.shift();
    this.stack.push(drawnCard);
    
    if (this.players[playerName].character.name === "Lucky Duke") {
        // Lucky Duke second card
        const secondDrawnCard = this.deck[0];
        this.deck.shift();
        this.stack.push(secondDrawnCard);
        console.log(`Player ${playerName} as Lucky Duke drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} and ${secondDrawnCard.name} ${secondDrawnCard.digit} ${secondDrawnCard.type} on barel`);
    }

    this.players[playerName].canUseBarel = false;
    this.setCardOnTableNotPlayable("Barilo", playerName);

    if (drawnCard.type === "hearts" || (this.players[playerName].character.name === "Lucky Duke" && secondDrawnCard.type === "hearts")) {
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
    if (!this.players[playerName].character.name === "Lucky Duke") {
        console.log(`Player ${playerName} drew ${drawnCard.name} ${drawnCard.digit} ${drawnCard.type} on barel`);
    }
}