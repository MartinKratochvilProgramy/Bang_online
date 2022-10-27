import React, { useEffect } from 'react';
import Bang from './cards/Bang';
import Mancato from './cards/Mancato';

export default function Game({ myHand, allPlayersInfo, selectPlayerTarget, setSelectPlayerTarget, username, socket, currentRoom, currentPlayer, setCurrentPlayer, playersLosingHealth }) { 
  
  useEffect(() => {
    socket.on("current_player", playerName => {
      console.log("Get my hand...");
      setCurrentPlayer(playerName);
      socket.emit("get_my_hand", {username, currentRoom});
    })
  
  }, [socket, setCurrentPlayer, username, currentRoom])
  

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

  function loseHealth() {
    socket.emit("lose_health", {username, currentRoom})
  }

  function endTurn() {
    socket.emit("end_turn", currentRoom);
  }

  return (
    <div>
      <h1 className={playerStyles}>Game</h1>
      <p>Current player: {currentPlayer}</p>
      
      <h2>Other players:</h2>
      {allPlayersInfo.map(player => {
        if (player.name === username) return(null); // don't display my hand size
        return (
          <div key={player.name} style={playerStyles}>
              Name: {player.name} Hand size: {player.numberOfCards} Health: {player.health} {selectPlayerTarget ? <button onClick={() => playBang(player.name)}>Select</button> : null}
          </div>
        )
      })}

      <h2>My hand</h2>
      <p>Player name: {username}</p>
      {allPlayersInfo.map(player => {
        if (player.name !== username) return(null); // don't display my hand size
        return (
          <div key={player.name}>
             Health: {player.health}
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
      {playersLosingHealth.map((player) => {
        if (player.name === username && player.isLosingHealth) {
          return (
            <button onClick={loseHealth}>Lose health</button>
          )
        }
        return (null)
      })}

    </div>
  )
}
