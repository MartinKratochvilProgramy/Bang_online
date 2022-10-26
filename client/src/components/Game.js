import React from 'react';

export default function Game({ myHand, allHands }) {

  
  return (
    <div>
      <h1>Game</h1>
      <h2>Cards in hand:</h2>
      {allHands.map(player => {
        return (
          <div key={player.name}>
            {player.name} {player.numberOfCards}
          </div>
        )
      })}
      {myHand.map(card => {
        return (
          <button key={card.digit + card.type}>
            {card.name} <br /> {card.digit} {card.type}
          </button>
        )
      })}

    </div>
  )
}
