import React, { useEffect, useState } from 'react';
import Card from './cards/Card';

export default function Game({ myHand, allPlayersInfo, username, socket, currentRoom, currentPlayer, playersLosingHealth, playersWithDynamite, topStackCard, duelActive }) { 
  
  const [nextTurn, setNextTurn] = useState(true);
  const [activeCard, setActiveCard] = useState({});
  const [playersInRange, setPlayersInRange] = useState([]);

  const [selectPlayerTarget, setSelectPlayerTarget] = useState(false);
  const [selectCardTarget, setSelectCardTarget] = useState(false);
  
  useEffect(() => {
    setNextTurn(true);
    // disable next turn button if health decision req on other players
    for (const player of playersLosingHealth) {
      if (player.isLosingHealth) {
        setNextTurn(false);
        break;
      }
    }
  }, [playersLosingHealth])

  useEffect(() => {
    setNextTurn(true);
    // disable next turn button if dynamite action req from current player
    for (const player of playersWithDynamite) {
      if (player.name === username && player.hasDynamite) {
        setNextTurn(false);
        break;
      }
    }
  }, [playersWithDynamite, username])

  socket.on("players_in_range", players => {
    setPlayersInRange(players);
  })
  

  function confirmPlayerTarget(target) {
    if (!selectPlayerTarget) return;
    setSelectPlayerTarget(false);
    setSelectCardTarget(false);
    const cardDigit = activeCard.digit;
    const cardType = activeCard.type;
    
    if (activeCard.name === "Bang!") {
      console.log("USERNAME: ", username);
      socket.emit("play_bang", {username, target, currentRoom, cardDigit, cardType });

    } else if (activeCard.name === "Duel") {
      socket.emit("play_duel", {username, target, currentRoom, cardDigit, cardType });

    } else if (activeCard.name === "Cat Ballou") {
      socket.emit("play_cat_ballou", {username, target, currentRoom, cardDigit, cardType });

    } else if (activeCard.name === "Panico") {
      socket.emit("play_panico", {username, target, currentRoom, cardDigit, cardType });
    }
    setActiveCard({});
  }
  
  function confirmCardTarget (cardName, cardDigit, cardType) {
    if(!selectCardTarget) return;
    setSelectPlayerTarget(false);
    setSelectCardTarget(false);
    if (activeCard.name === "Cat Ballou") {
      socket.emit("play_cat_ballou_on_table_card", { activeCard, username, target: cardName, currentRoom, cardDigit, cardType });
    } else if (activeCard.name === "Panico") {
      socket.emit("play_panico_on_table_card", { activeCard, username, target: cardName, currentRoom, cardDigit, cardType });
    }
    setActiveCard({});
  }

  function cancelTargetSelect() {
    setSelectPlayerTarget(false);
    setSelectCardTarget(false);
    setActiveCard({});
  }


  function playCardOnTable(card) {
    if (!card.isPlayable) return;
    if (card.name === "Barilo") {
      socket.emit("use_barel", {username, currentRoom});
    }
    if (card.name === "Dynamite") {
      socket.emit("use_dynamite", {username, currentRoom, card});
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
      <h1>Game</h1>
      <p>Current player: {currentPlayer}</p>
      
      <h2>Other players:</h2>
      {allPlayersInfo.map(player => {
        if (player.name === username) return(null); // don't display my hand size
        let playerColorStyles;
        let tableCardColorStyles;
        if (playersInRange.includes(player.name)) {
          if (selectPlayerTarget) {
            // display players in range
            playerColorStyles = {color: "red"}
          }
          if (selectCardTarget) {
            // display cards in range
            tableCardColorStyles = {color: "red"}
          }
        } else {
          playerColorStyles = {color: "black"}
        }
        return (
          <div key={player.name}>
            <div style={playerColorStyles}>
                Name: {player.name} Hand size: {player.numberOfCards} Health: {player.health} <button onClick={() => confirmPlayerTarget(player.name)}>Select</button>
                <br />
            </div>
            {player.table.map(card => {
              return (
                <button style={tableCardColorStyles} onClick={() => confirmCardTarget(card.name, card.digit, card.type)}>
                  {card.name} <br /> {card.digit} {card.type}
                </button>
              )
            })}
          </div>
        )
      })}

      <h2>Stack</h2>
      {topStackCard ? 
        <button> 
            {topStackCard.name} <br /> {topStackCard.digit} {topStackCard.type}
        </button>  
      :
        null      
      }

      <h2>My hand</h2>
      <p>Player name: {username}</p>
      {allPlayersInfo.map(player => {
        if (player.name !== username) return(null); // display only my stats
        return (
          <div key={player.name}>
            <div>
              Health: {player.health}
            </div>
            <div>
              Table: <br />
              {player.table.map(card => {
                console.log("CARD ON TABLE: ", card);
                  let tableCardColorStyles = {color: "black"};
                  if (card.isPlayable) {
                      tableCardColorStyles = {color: "red"}
                  }
                return (
                  <button style={tableCardColorStyles} key={card.digit + card.type} onClick={() => playCardOnTable(card)}>
                    {card.name} <br /> {card.digit} {card.type}
                  </button>
                )
              })}
            </div>
          
          </div>
        )
      })}
      
      <p>Hand:</p>
      {myHand.map(card => {
        return(
          <Card 
              socket={socket}
              card={card}
              key={card.digit + card.type}
              setSelectPlayerTarget={setSelectPlayerTarget}
              setSelectCardTarget={setSelectCardTarget}
              currentRoom={currentRoom}
              setActiveCard={setActiveCard}
              username={username}
              duelActive={duelActive}
              />
        )
      })}

      <br />
      {(currentPlayer === username && nextTurn) ? <button style={{color: "red"}} onClick={endTurn}>End turn</button> : null}
      {selectPlayerTarget ? <button style={{color: "red"}} onClick={cancelTargetSelect}>Cancel</button> : null}
      {playersLosingHealth.map((player) => {
        if (player.name === username && player.isLosingHealth) {
          return (
            <button key={player.name} style={{color: "red"}} onClick={loseHealth}>Lose health</button>
          )
        }
        return (null)
      })}

    </div>
  )
}
