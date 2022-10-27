import React, { useEffect, useState } from 'react';
import Bang from './cards/Bang';
import Mancato from './cards/Mancato';

export default function Game({ myHand, allPlayersInfo, setAllPlayersInfo, selectPlayerTarget, setSelectPlayerTarget, username, socket, currentRoom, currentPlayer, playersLosingHealth, topStackCard }) { 
  
  const [nextTurn, setNextTurn] = useState(true);
  const [activeCard, setActiveCard] = useState({});
  const [playersInRange, setPlayersInRange] = useState([]);
  
  useEffect(() => {
    // disable next turn button if health decision req on other players
    setNextTurn(true);
    for (const player of playersLosingHealth) {
      if (player.isLosingHealth) {
        setNextTurn(false);
        break;
      }
    }
  
  }, [playersLosingHealth])

  socket.on("players_in_range", players => {
    setPlayersInRange(players);
  })
  

  let playerStyles;
  if (selectPlayerTarget) {
    playerStyles = {color: "red"};
  } else {
    playerStyles = {color: "black"};
  }

  function confirmTarget(target) {
    setSelectPlayerTarget(false);
    const cardDigit = activeCard.cardDigit;
    const cardType = activeCard.cardType;
    if (activeCard.name === "Bang!") {
      socket.emit("play_bang", {username, target, currentRoom, cardDigit, cardType });
    }
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
        if (selectPlayerTarget && playersInRange.includes(player.name)) {
          console.log("true");
          return (
            <div key={player.name} style={{color: "red"}}>
                Name: {player.name} Hand size: {player.numberOfCards} Health: {player.health} <button onClick={() => confirmTarget(player.name)}>Select</button>
            </div>
          )
        } else {
          return (
            <div key={player.name} style={{color: "black"}}>
                Name: {player.name} Hand size: {player.numberOfCards} Health: {player.health} 
            </div>
          )
        }
      })}

      <h2>Stack</h2>
        <button> 
            {topStackCard.name} <br /> {topStackCard.digit} {topStackCard.type}
        </button>  

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
              socket={socket}
              cardDigit={card.digit} 
              cardType={card.type} 
              key={card.digit + card.type}
              setSelectPlayerTarget={setSelectPlayerTarget}
              currentRoom={currentRoom}
              setActiveCard={setActiveCard}
              isPlayable={card.isPlayable}
              username={username} />
              )
        } else {
          return (
            <Mancato
              key={card.digit + card.type}
              socket={socket}
              cardDigit={card.digit} 
              cardType={card.type} 
              username={username}
              currentRoom={currentRoom}
              isPlayable={card.isPlayable} />
          )
        }
      })}

      <br />
      {(currentPlayer === username && nextTurn) ? <button onClick={endTurn}>End turn</button> : null}
      {playersLosingHealth.map((player) => {
        if (player.name === username && player.isLosingHealth) {
          return (
            <button key={username} onClick={loseHealth}>Lose health</button>
          )
        }
        return (null)
      })}

    </div>
  )
}
