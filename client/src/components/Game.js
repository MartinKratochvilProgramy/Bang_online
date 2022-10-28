import React, { useEffect, useState } from 'react';
import Card from './cards/Card';

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
      setActiveCard({});

    } else if (activeCard.name === "Duel") {
      socket.emit("play_duel", {username, target, currentRoom, cardDigit, cardType });
      setActiveCard({});

    } else if (activeCard.name === "Cat Ballou") {
      socket.emit("play_cat_ballou", {username, target, currentRoom, cardDigit, cardType });
      setActiveCard({});

    } else if (activeCard.name === "Panico") {
      socket.emit("play_panico", {username, target, currentRoom, cardDigit, cardType });
      setActiveCard({});
    }
  }

  function cancelTargetSelect() {
    setSelectPlayerTarget(false);
    setActiveCard({});
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
        let colorStyles;
        if (selectPlayerTarget && playersInRange.includes(player.name)) {
          // display players in range
          colorStyles = {color: "red"}
        } else {
          colorStyles = {color: "black"}
        }
        return (
          <div>
            <div key={player.name} style={colorStyles}>
                Name: {player.name} Hand size: {player.numberOfCards} Health: {player.health} {selectPlayerTarget ? <button onClick={() => confirmTarget(player.name)}>Select</button> : null}
                <br />
            </div>
            {player.table.map(card => {
              return (
                <div key={card.digit + card.type}>
                  {card.name}
                </div>
              )
            })}
          </div>
        )
      })}

      <h2>Stack</h2>
        <button> 
            {topStackCard.name} <br /> {topStackCard.digit} {topStackCard.type}
        </button>  

      <h2>My hand</h2>
      <p>Player name: {username}</p>
      {allPlayersInfo.map(player => {
        if (player.name !== username) return(null); // display my stats
        return (
          <div key={player.name}>
             Health: {player.health}
          </div>
        )
      })}
      
      {myHand.map(card => {
        return(
          <Card 
              socket={socket}
              cardDigit={card.digit} 
              cardType={card.type} 
              cardName={card.name}
              key={card.digit + card.type}
              setSelectPlayerTarget={setSelectPlayerTarget}
              currentRoom={currentRoom}
              setActiveCard={setActiveCard}
              isPlayable={card.isPlayable}
              username={username} />
        )
      })}

      <br />
      {(currentPlayer === username && nextTurn) ? <button style={{color: "red"}} onClick={endTurn}>End turn</button> : null}
      {selectPlayerTarget ? <button style={{color: "red"}} onClick={cancelTargetSelect}>Cancel</button> : null}
      {playersLosingHealth.map((player) => {
        if (player.name === username && player.isLosingHealth) {
          return (
            <button key={username} style={{color: "red"}} onClick={loseHealth}>Lose health</button>
          )
        }
        return (null)
      })}

    </div>
  )
}
