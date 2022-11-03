const test = require('test');
const assert = require('assert');
const Game = require('../game.js')

test('draw 2 cards on start', t => {
  const bangMancatoDeck = [    
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 1,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 6,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 7,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 8,
        type: "hearts",
        isPlayable: false
    },
  ]

  const game = new Game(["Sbeve", "Joe"], bangMancatoDeck);
  game.players["Sbeve"].character.startingHandSize = 2;
  game.players["Joe"].character.startingHandSize = 2;
  game.startGame();
  assert.strictEqual(game.players["Sbeve"].hand.length, 4)
  game.endTurn();
  assert.strictEqual(game.players["Joe"].hand.length, 4)
})

test('play Bang!', t => {
  const bangMancatoDeck = [    
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 1,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 6,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 7,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 8,
        type: "hearts",
        isPlayable: false
    },
  ]

  const game = new Game(["Sbeve", "Joe"], bangMancatoDeck);
  game.players["Sbeve"].character.startingHandSize = 2;
  game.players["Joe"].character.startingHandSize = 2;
  game.startGame();
  game.useBang("Joe", 1, "hearts");
  assert.strictEqual(game.stack.some(card => card.name === "Bang!"), true)          // Bang! on stack
  assert.strictEqual(game.players["Sbeve"].hand.some(card => card.digit === 1), false)   // Bang! not in hand
  assert.strictEqual(game.players["Joe"].isLosingHealth, true)                      // oponent losing health
})

test('play Mancato!', t => {
  const bangMancatoDeck = [    
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 1,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 6,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 7,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 8,
        type: "hearts",
        isPlayable: false
    },
  ]

  const game = new Game(["Sbeve", "Joe"], bangMancatoDeck);
  game.players["Sbeve"].character.startingHandSize = 2;
  game.players["Joe"].character.startingHandSize = 2;
  game.startGame();
  console.log("HAND: ", game.players["Sbeve"].hand);
  game.useBang("Joe", 1, "hearts");
  game.useMancato("Joe", 4, "hearts")
  assert.strictEqual(game.stack.some(card => card.name === "Mancato!"), true)          // Bang! on stack
  assert.strictEqual(game.players["Sbeve"].hand.some(card => card.digit === 4), false)   // Bang! not in hand
  assert.strictEqual(game.players["Joe"].isLosingHealth, false)                      // oponent losing health
})

test('lose life', t => {
  const bangMancatoDeck = [    
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 1,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 6,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 7,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 8,
        type: "hearts",
        isPlayable: false
    },
  ]

  const game = new Game(["Sbeve", "Joe"], bangMancatoDeck);
  game.players["Sbeve"].character.startingHandSize = 2;
  game.players["Joe"].character.startingHandSize = 2;
  game.players["Joe"].character.health = 2;
  game.startGame();
  game.useBang("Joe", 1, "hearts");
  game.loseHealth("Joe");
  assert.strictEqual(game.players["Joe"].character.health, 1);
  assert.strictEqual(game.players["Joe"].isLosingHealth, false);
})

test('use barel -> draw hearts', t => {
  const barelDeck = [    
    {
        name: "Barilo",
        rimColor: "blue",
        digit: 10,
        type: "hearts",
        class: "barel",
        isPlayable: false,
        actionReqOnStart: false,
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 6,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 7,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 8,
        type: "hearts",
        isPlayable: false
    },
    // first barel draw
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 8,
        type: "hearts",
        isPlayable: false
    },
  ]

  const game = new Game(["Sbeve", "Joe"], barelDeck);
  game.players["Sbeve"].character.startingHandSize = 2;
  game.players["Joe"].character.startingHandSize = 2;
  game.startGame();
  game.placeBlueCardOnTable({
        name: "Barilo",
        rimColor: "blue",
        digit: 10,
        type: "hearts",
        class: "barel",
        isPlayable: false,
        actionReqOnStart: false,
    }, "Sbeve");
  assert.strictEqual(game.players["Sbeve"].table.some(card => card.name === "Barilo"), true);
  game.endTurn();
  game.useBang("Sbeve", 3, "hearts", "Joe");
  assert.strictEqual(game.players["Sbeve"].isLosingHealth, true);
  game.useBarel("Sbeve");
  assert.strictEqual(game.players["Sbeve"].isLosingHealth, false);
})

test('use barel -> not draw hearts', t => {
  const barelDeck = [    
    {
        name: "Barilo",
        rimColor: "blue",
        digit: 10,
        type: "hearts",
        class: "barel",
        isPlayable: false,
        actionReqOnStart: false,
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 6,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 7,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 8,
        type: "hearts",
        isPlayable: false
    },
    // first barel draw
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 8,
        type: "spades",
        isPlayable: false
    },
  ]

  const game = new Game(["Sbeve", "Joe"], barelDeck);
  game.players["Sbeve"].character.startingHandSize = 2;
  game.players["Joe"].character.startingHandSize = 2;
  game.startGame();
  game.placeBlueCardOnTable({
        name: "Barilo",
        rimColor: "blue",
        digit: 10,
        type: "hearts",
        class: "barel",
        isPlayable: false,
        actionReqOnStart: false,
    }, "Sbeve");
  assert.strictEqual(game.players["Sbeve"].table.some(card => card.name === "Barilo"), true);
  game.endTurn();
  game.useBang("Sbeve", 3, "hearts", "Joe");
  assert.strictEqual(game.players["Sbeve"].isLosingHealth, true);
  game.useBarel("Sbeve");
  assert.strictEqual(game.players["Sbeve"].isLosingHealth, true);
})

test('use Panico on player', t => {
  const panicoDeck = [    
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 1,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },  
  ]

  const game = new Game(["Sbeve", "Joe"], panicoDeck);
  game.players["Sbeve"].character.startingHandSize = 2;
  game.players["Joe"].character.startingHandSize = 1;
  game.startGame();
  game.usePanico("Joe", 1, "hearts", "Sbeve");
  assert.strictEqual(game.stack.some(card => card.name === "Panico"), true)                // on stack
  assert.strictEqual(game.players["Sbeve"].hand.some(card => card.digit === 1), false)      // not in hand
  assert.strictEqual(game.players["Sbeve"].hand.some(card => card.digit === 3), true)      // card in hand
})

test('use Panico on table', t => {
  const panicoDeck = [    
      {
        name: "Barilo",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "barel",
        isPlayable: false,
        actionReqOnStart: false,
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Panico",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 6,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 7,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 8,
        type: "hearts",
        isPlayable: false
    },  
  ]

  const game = new Game(["Sbeve", "Joe"], panicoDeck);
  game.players["Sbeve"].character.startingHandSize = 2;
  game.players["Joe"].character.startingHandSize = 1;
  game.startGame();
  game.placeBlueCardOnTable({
        name: "Barilo",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "barel",
        isPlayable: false,
        actionReqOnStart: false,
    }, "Sbeve");
  game.endTurn();
  game.usePanicoOnTableCard(    {
        name: "Panico",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    }, "Barilo", 1, "hearts", "Joe");
  assert.strictEqual(game.players["Sbeve"].table.some(card => card.name === "Barilo"), false);
  assert.strictEqual(game.players["Joe"].hand.some(card => card.name === "Barilo"), true);
  assert.strictEqual(game.players["Joe"].hand.some(card => card.name === "Panico"), false);
})

test('use Cat Balou on player', t => {
  const panicoDeck = [    
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 1,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },  
  ]

  const game = new Game(["Sbeve", "Joe"], panicoDeck);
  game.players["Sbeve"].character.startingHandSize = 2;
  game.players["Joe"].character.startingHandSize = 1;
  game.startGame();
  game.useCatBallou("Joe", 1, "hearts", "Sbeve");
  assert.strictEqual(game.stack.some(card => card.name === "Cat Balou"), true)                // on stack
  assert.strictEqual(game.players["Sbeve"].hand.some(card => card.digit === 1), false)      // not in hand
  assert.strictEqual(game.players["Sbeve"].hand.length, 3)      // card in hand
  assert.strictEqual(game.players["Joe"].hand.length, 0)      // card in hand
})

test('use Cat Balou on table', t => {
  const panicoDeck = [    
      {
        name: "Barilo",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "barel",
        isPlayable: false,
        actionReqOnStart: false,
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 6,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 7,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 8,
        type: "hearts",
        isPlayable: false
    },  
  ]

  const game = new Game(["Sbeve", "Joe"], panicoDeck);
  game.players["Sbeve"].character.startingHandSize = 2;
  game.players["Joe"].character.startingHandSize = 1;
  game.startGame();
  game.placeBlueCardOnTable({
        name: "Barilo",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "barel",
        isPlayable: false,
        actionReqOnStart: false,
    }, "Sbeve");
  game.endTurn();
  game.useCatBallouOnTableCard(    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    }, "Barilo", 1, "hearts", "Joe");
  assert.strictEqual(game.players["Sbeve"].table.some(card => card.name === "Barilo"), false);
  assert.strictEqual(game.players["Joe"].hand.some(card => card.name === "Barilo"), false);
  assert.strictEqual(game.players["Joe"].hand.some(card => card.name === "Cat Balou"), false);
})

test('use prison, draw on prison and suceed', t => {
  const prisonDeck = [    
    {
        name: "Prigione",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "prison",
        isPlayable: false,
        actionReqOnStart: false,
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },
  ]

  const game = new Game(["Sbeve", "Joe"], prisonDeck);
  game.players["Sbeve"].character.startingHandSize = 1;
  game.players["Joe"].character.startingHandSize = 1;
  game.startGame();
  console.log(game.players["Sbeve"].hand)
  game.playPrigione("Joe", {
        name: "Prigione",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "prison",
        isPlayable: false,
        actionReqOnStart: false,
    }, "Sbeve");
  game.endTurn();
  assert.strictEqual(game.players["Sbeve"].hand.some(card => card.name === "Prigione"), false);
  assert.strictEqual(game.players["Joe"].table.some(card => card.name === "Prigione"), true);
  
  // draw on prison, succeed
  game.usePrigione("Joe", {
    name: "Prigione",
    rimColor: "blue",
    digit: 1,
    type: "hearts",
    class: "prison",
    isPlayable: false,
    actionReqOnStart: false,
  })
  assert.strictEqual(game.players["Joe"].table.some(card => card.name === "Prigione"), false);
  assert.strictEqual(game.getNameOfCurrentTurnPlayer(), "Joe")

})

test('use prison, draw on prison and fail', t => {
  const prisonDeck = [    
    {
        name: "Prigione",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "prison",
        isPlayable: false,
        actionReqOnStart: false,
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 5,
        type: "spades",
        isPlayable: false
    },
  ]

  const game = new Game(["Sbeve", "Joe"], prisonDeck);
  game.players["Sbeve"].character.startingHandSize = 1;
  game.players["Joe"].character.startingHandSize = 1;
  game.startGame();
  console.log(game.players["Sbeve"].hand)
  game.playPrigione("Joe", {
        name: "Prigione",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "prison",
        isPlayable: false,
        actionReqOnStart: false,
    }, "Sbeve");
  game.endTurn();
  assert.strictEqual(game.players["Sbeve"].hand.some(card => card.name === "Prigione"), false);
  assert.strictEqual(game.players["Joe"].table.some(card => card.name === "Prigione"), true);
  
  // draw on prison, succeed
  game.usePrigione("Joe", {
    name: "Prigione",
    rimColor: "blue",
    digit: 1,
    type: "hearts",
    class: "prison",
    isPlayable: false,
    actionReqOnStart: false,
  })
  assert.strictEqual(game.players["Joe"].table.some(card => card.name === "Prigione"), false);
  assert.strictEqual(game.getNameOfCurrentTurnPlayer(), "Sbeve")

})

test('use dynamite', t => {
  const dynamiteDeck = [    
    {
        name: "Dynamite",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "dynamite",
        isPlayable: false,
        actionReqOnStart: false,
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 2,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Cat Balou",
        rimColor: "yellow",
        digit: 3,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 4,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 5,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 6,
        type: "hearts",
        isPlayable: false
    },  
    {
        name: "Mancato!",
        rimColor: "yellow",
        digit: 7,
        type: "hearts",
        isPlayable: false
    },
    {
        name: "Bang!",
        rimColor: "yellow",
        digit: 8,
        type: "hearts", // this is drawn on dynamite
        isPlayable: false
    },  
  ]

  const game = new Game(["Sbeve", "Joe"], dynamiteDeck);
  game.players["Sbeve"].character.startingHandSize = 1;
  game.players["Joe"].character.startingHandSize = 1;
  game.startGame();
  game.placeBlueCardOnTable({
        name: "Dynamite",
        rimColor: "blue",
        digit: 1,
        type: "hearts",
        class: "dynamite",
        isPlayable: false,
        actionReqOnStart: false,
    }, "Sbeve");
  game.endTurn();
  assert.strictEqual(game.players["Sbeve"].hand.some(card => card.name === "Dynamite"), false);
  assert.strictEqual(game.players["Sbeve"].table.some(card => card.name === "Dynamite"), true);
  game.endTurn();
  game.useDynamite("Sbeve", {
    name: "Dynamite",
    rimColor: "blue",
    digit: 1,
    type: "hearts",
    class: "dynamite",
    isPlayable: false,
    actionReqOnStart: false,
  })
  assert.strictEqual(game.players["Sbeve"].table.some(card => card.name === "Dynamite"), false);
  assert.strictEqual(game.players["Joe"].table.some(card => card.name === "Dynamite"), true);
})
