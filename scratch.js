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
                if (currentEmporioTurnPlayerIndex >= this.numOfPlayers) {
                    currentEmporioTurnPlayerIndex = 0;
                }
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