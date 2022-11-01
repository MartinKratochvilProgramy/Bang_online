import React, { useEffect, useState } from 'react';
import Card from './cards/Card';

export default function Game({ myHand, allPlayersInfo, username, character, socket, currentRoom, currentPlayer, playersLosingHealth, playersActionRequiredOnStart, topStackCard, duelActive, indianiActive, emporioState, myDrawChoice, nextEmporioTurn, characterUsable, setCharacterUsable }) { 
  
  const [nextTurn, setNextTurn] = useState(true);
  const [activeCard, setActiveCard] = useState({});
  const [playersInRange, setPlayersInRange] = useState([]);
  const [myHealth, setMyHealth] = useState(null);

  const [selectPlayerTarget, setSelectPlayerTarget] = useState(false);
  const [selectCardTarget, setSelectCardTarget] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  
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
    for (const player of allPlayersInfo) {
      if (player.name === username) {
        setMyHealth(player.health)
      }
    }
  
  }, [allPlayersInfo, username])
  

  useEffect(() => {
    setNextTurn(true);
    // disable next turn button if dynamite, prison or action req from current player
    for (const player of playersActionRequiredOnStart) {
      if (player.name === username && (player.hasDynamite || player.isInPrison || player.actionRequired)) {
        setNextTurn(false);
        setCharacterUsable(true);
        break;
      }
    }
  }, [playersActionRequiredOnStart, username, setCharacterUsable])

  socket.on("players_in_range", players => {
    setPlayersInRange(players);
  })

  socket.on("end_discard", () => {
    console.log("End discard");
    setDiscarding(false);
  })

  socket.on("jourdonnais_can_use_barel", () => {
    if (character === "Jourdonnais") {
      setCharacterUsable(true);
    }
  })

  function confirmPlayerTarget(target) {
    if (!selectPlayerTarget) return;
    setSelectPlayerTarget(false);
    setSelectCardTarget(false);
    const cardDigit = activeCard.digit;
    const cardType = activeCard.type;
   
    if (activeCard.name === "Bang!") {
      socket.emit("play_bang", {username, target, currentRoom, cardDigit, cardType});

    } else if (activeCard.name === "Mancato!" && character === "Calamity Janet") {
      socket.emit("play_mancato_as_CJ", {target, currentRoom, cardDigit, cardType});

    } else if (activeCard.name === "Duel") {
      socket.emit("play_duel", {target, currentRoom, cardDigit, cardType});

    } else if (activeCard.name === "Cat Ballou") {
      socket.emit("play_cat_ballou", {target, currentRoom, cardDigit, cardType});

    } else if (activeCard.name === "Panico") {
      socket.emit("play_panico", {target, currentRoom, cardDigit, cardType});

    } else if (activeCard.name === "Prigione") {
      socket.emit("play_prigione", {username, target, currentRoom, activeCard});

    } else if (Object.keys(activeCard).length === 0 && character === "Jesse Jones") {
      // no active card and Jese jones
      socket.emit("jesse_jones_target", {username, target, currentRoom});
      setCharacterUsable(false);
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
    if (card.name === "Prigione") {
      socket.emit("use_prigione", {username, currentRoom, card});
    }
  }

  function getEmporioCard(card) {
    socket.emit("get_emporio_card", {username, currentRoom, card});
  }
  
  function getChoiceCard(card) {
    setCharacterUsable(false);
    if (character === "Kit Carlson") {
      socket.emit("get_choice_card_KC", {username, currentRoom, card});
    } else if (character === "Lucky Duke") {
      socket.emit("get_choice_card_LD", {username, currentRoom, card});
    }
  }

  function loseHealth() {
    socket.emit("lose_health", {username, currentRoom})
  }

  function activateCharacter() {
    if (!characterUsable) return;
    if (character === "Jesse Jones") {
      setSelectPlayerTarget(true);
      socket.emit("request_players_in_range", {range: "max", currentRoom, username});
    }
    if (character === "Jourdonnais") {
      setCharacterUsable(false);
      socket.emit("jourdonnais_barel", {currentRoom, username});
    }
  }

  function drawFromDeck() {
    socket.emit("jesse_jones_draw_from_deck", {currentRoom, username})
    setCharacterUsable(false);
  }

  function endTurn() {
    if (myHand.length > myHealth) {
      setDiscarding(true);
    } else {
      socket.emit("end_turn", currentRoom);
    }
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
      {topStackCard && 
        <button> 
            {topStackCard.name} <br /> {topStackCard.digit} {topStackCard.type}
        </button>        
      }
      {(character === "Jesse Jones" && characterUsable) ? 
        <button onClick={() => drawFromDeck()} style={{color: "red"}} type="">Deck <br/>..</button>
        :
        <button  type="">Deck <br/>..</button>
      }
      <br />
      {emporioState.length > 0 ? <p>Emporio:</p> : null}
      {emporioState.map(card => {
        let emporioStyles = {color: "black"};
        if (nextEmporioTurn === username) {
          emporioStyles = {color: "red"}
        }
        return (
          <button style={emporioStyles} onClick={() => getEmporioCard(card)}>
            {card.name} <br /> {card.digit} {card.type}
          </button>
        )
      })}
      <br />
      {myDrawChoice.length > 0 ? <p>{character}'s card choice:</p> : null}
      {myDrawChoice.map(card => {
        return (
          <button style={{color: "red"}} onClick={() => getChoiceCard(card)}>
            {card.name} <br /> {card.digit} {card.type}
          </button>
        )
      })}

      <h2>My hand</h2>
      <p>Player name: {username}</p>
      {characterUsable ? <p>Character: <button style={{color: "red"}} onClick={() => activateCharacter()}>{character}</button></p> : <p>Character: <button type="">{character}</button></p>}
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
              currentPlayer={currentPlayer}
              duelActive={duelActive}
              indianiActive={indianiActive}
              discarding={discarding}
              character={character}
              />
        )
      })}

      <br />
      {(currentPlayer === username && nextTurn && !characterUsable && emporioState.length === 0 && !(myDrawChoice.length > 0)) ? <button style={{color: "red"}} onClick={endTurn}>End turn</button> : null}
      {(selectPlayerTarget && currentPlayer === username) ? <button style={{color: "red"}} onClick={cancelTargetSelect}>Cancel</button> : null}
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

