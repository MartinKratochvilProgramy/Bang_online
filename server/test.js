const deck = require('./deck.js')

for (let i = 0; i < deck.length; i++) {
    for (let j = i + 1; j < deck.length; j++) {
        if (deck[i].digit === deck[j].digit && deck[i].type === deck[j].type) {
            console.log(deck[i].name, deck[i].digit, deck[i].type, " === ", deck[j].name, deck[j].digit, deck[j].type);
        }
    }
}




