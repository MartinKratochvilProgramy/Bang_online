import React, { useEffect } from 'react';
import Bang from './cards/Bang';
import Mancato from './cards/Mancato';

export default function Game({ myHand, allHands, selectPlayerTarget, setSelectPlayerTarget, username, socket, currentRoom, currentPlayer, setCurrentPlayer }) { 
  
  useEffect(() => {
    socket.on("current_player", playerName => {
      setCurrentPlayer(playerName);
      socket.emit("get_my_hand", {username, currentRoom});
    })
  
  }, [])
  

  let playerStyles;
  if (selectPlayerTarget) {
    playerStyles = {color: "red"};
  } else {
    playerStyles = {color: "black"};
  }

  function playBang(target) {
    console.log("target: ", target);
    setSelectPlayerTarget(false);
    socket.emit("play_bang", {username, target, currentRoom});
  }

  function playMancato() {
    socket.emit("play_mancato", {username, currentRoom});
  }

  function endTurn() {
    socket.emit("end_turn", currentRoom);
  }

  return (
    <div>
      <h1 className={playerStyles}>Game</h1>
      <p>Current player: {currentPlayer}</p>
      
      <h2>Other players' hands:</h2>
      {allHands.map(player => {
        if (player.name === username) return(null); // don't display my hand size
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
            <Mancato 
              cardDigit={card.digit} 
              cardType={card.type} 
              key={card.digit + card.type}
              playMancato={playMancato}
              isPlayable={card.isPlayable} />
          )
        }
      })}

      <br />
      {currentPlayer === username ? <button onClick={endTurn}>End turn</button> : null}
      

    </div>
  )
}
