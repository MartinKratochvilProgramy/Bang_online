import React from 'react';
import Bang from './cards/Bang';

export default function Game({ myHand, allHands, selectPlayerTarget, setSelectPlayerTarget }) {
    let playerStyles;
    if (selectPlayerTarget) {
      playerStyles = {color: "red",cursor: "pointer"};
    } else {
      playerStyles = {color: "black"};
    }

  return (
    <div>
      <h1 className={playerStyles}>Game</h1>
      <h2>Cards in hand:</h2>
      {allHands.map(player => {
        return (
          <div key={player.name} style={playerStyles}>
            {player.name} {player.numberOfCards}
          </div>
        )
      })}
      {myHand.map(card => {
        if (card.name === "Bang!") {
          return (
            <Bang 
              cardDigit={card.digit} 
              cardType={card.type} 
              key={card.digit + card.type}
              setSelectPlayerTarget={setSelectPlayerTarget} />
          )
        } else {
          return (
            <button key={card.digit + card.type}>
              {card.name} <br /> {card.digit} {card.type}
            </button>
          )
        }
      })}

    </div>
  )
}
