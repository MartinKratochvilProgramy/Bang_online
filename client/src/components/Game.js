import React from 'react';
import Bang from './cards/Bang';

export default function Game({ myHand, allHands, selectPlayerTarget, setSelectPlayerTarget, username, socket }) {
    let playerStyles;
    if (selectPlayerTarget) {
      playerStyles = {color: "red"};
    } else {
      playerStyles = {color: "black"};
    }

  function playBang(target) {
    console.log("target: ", target);
    setSelectPlayerTarget(false);
    socket.emit("play_bang", {username, target});
  }

  return (
    <div>
      <h1 className={playerStyles}>Game</h1>
      
      <h2>Other players' hands:</h2>
      {allHands.map(player => {
        if (player.name === username) return(null); // don't display my hand
        return (
          <div key={player.name} style={playerStyles}>
              {player.name} {player.numberOfCards} {selectPlayerTarget ? <button onClick={() => playBang(player.name)}>Select</button> : null}
          </div>
        )
      })}

      <h2>My hand</h2>
      {myHand.map(card => {
        if (card.name === "Bang!") {
          return (
            <Bang 
              cardDigit={card.digit} 
              cardType={card.type} 
              key={card.digit + card.type}
              setSelectPlayerTarget={setSelectPlayerTarget}
              isPlayable={card.isPlayable} />
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
