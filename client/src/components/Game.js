import React, { useEffect, useState } from 'react';
import PlayerTable from './PlayerTable';
import Oponents from './Oponents';
import Chat from './Chat';
import Console from './Console';
import StackDeck from './StackDeck';

export default function Game({ myHand, allPlayersInfo, username, character, socket, currentRoom, currentPlayer, playersLosingHealth, playersActionRequiredOnStart, topStackCard, duelActive, 
  indianiActive, emporioState, myDrawChoice, nextEmporioTurn, characterUsable, setCharacterUsable, sendMessage, messages }) { 
  
  const [nextTurn, setNextTurn] = useState(true);
  const [activeCard, setActiveCard] = useState({});
  const [playersInRange, setPlayersInRange] = useState([]);
  const [myHealth, setMyHealth] = useState(null);

  const [selectPlayerTarget, setSelectPlayerTarget] = useState(false);
  const [selectCardTarget, setSelectCardTarget] = useState(false);
  const [discarding, setDiscarding] = useState(false);

  const [deckActive, setDeckActive] = useState(false);
  
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
        setCharacterUsable(false);
        break;
      }
    }
  }, [playersActionRequiredOnStart, username, setCharacterUsable, character])

  socket.on("players_in_range", players => {
    setPlayersInRange(players);
  })

  socket.on("update_draw_choices", (characterName) => {
    console.log("Username", username);
    console.log("currentRoom", currentRoom);
    console.log("character", character);
    if (username === "") return;
    if (currentRoom === null) return;
    if (characterName === character) {

      if (characterName === "Jesse Jones") {
        setSelectPlayerTarget(true);
        setDeckActive(true);
        socket.emit("request_players_in_range", {range: "max", currentRoom, username});

      } else if (characterName === "Pedro Ramirez") {
        setCharacterUsable(true);

      } else {
        socket.emit("get_my_draw_choice", {username, currentRoom, character});
      }
    }
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

    } else if (activeCard.name === "Cat Balou") {
      socket.emit("play_cat_ballou", {target, currentRoom, cardDigit, cardType});

    } else if (activeCard.name === "Panico") {
      socket.emit("play_panico", {target, currentRoom, cardDigit, cardType});

    } else if (activeCard.name === "Prigione") {
      socket.emit("play_prigione", {username, target, currentRoom, activeCard});

    } else if (Object.keys(activeCard).length === 0 && character === "Jesse Jones") {
      // no active card and Jese jones
      socket.emit("jesse_jones_target", {username, target, currentRoom});
      setCharacterUsable(false);
      setDeckActive(false);
    }
    setActiveCard({});
  }
  
  function confirmCardTarget (cardName, cardDigit, cardType) {
    if(!selectCardTarget) return;
    setSelectPlayerTarget(false);
    setSelectCardTarget(false);
    if (activeCard.name === "Cat Balou") {
      socket.emit("play_cat_ballou_on_table_card", { activeCard, username, target: cardName, currentRoom, cardDigit, cardType });
    } else if (activeCard.name === "Panico") {
      socket.emit("play_panico_on_table_card", { activeCard, username, target: cardName, currentRoom, cardDigit, cardType });
    }
    setActiveCard({});
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


  function activateCharacter() {
    if (!characterUsable && character !== "Sid Ketchum") return;

    if (character === "Jourdonnais") {
      setCharacterUsable(false);
      socket.emit("jourdonnais_barel", {currentRoom, username});
    }

    if (character === "Pedro Ramirez") {
      setCharacterUsable(false);
      socket.emit("get_stack_card_PR", {currentRoom, username});
    }

    if (character === "Sid Ketchum") {
      setDiscarding(true)
    }
  }

  function drawFromDeck() {
    socket.emit("draw_from_deck", {currentRoom, username})
    setCharacterUsable(false);
    setSelectPlayerTarget(false);
    setDeckActive(false);
  }
  
  return (
    <div id='game'>
      <div>
        <Oponents
          socket={socket}
          myHand={myHand}
          allPlayersInfo={allPlayersInfo}
          currentRoom={currentRoom}
          activateCharacter={activateCharacter}
          username={username}
          selectCardTarget={selectCardTarget}
          confirmCardTarget={confirmCardTarget}
          selectPlayerTarget={selectPlayerTarget}
          currentPlayer={currentPlayer}
          characterUsable={characterUsable}
          myHealth={myHealth}
          playersInRange={playersInRange}
          confirmPlayerTarget={confirmPlayerTarget}
        />
      </div>

      <div className='fixed top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] m-auto'>
        <StackDeck 
          socket={socket} 
          username={username} 
          currentRoom={currentRoom} 
          currentPlayer={currentPlayer}
          topStackCard={topStackCard}
          deckActive={deckActive}
          drawFromDeck={drawFromDeck}
        />
      </div>

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

      <div className='fixed flex justify-between items-end bottom-0 left-0 right-0 z-20'>
        <Chat sendMessage={sendMessage} messages={messages} width={260} />
        <PlayerTable
          socket={socket}
          myHand={myHand}
          table={allPlayersInfo.filter(player => {return(player.name === username)})[0].table}
          setSelectPlayerTarget={setSelectPlayerTarget}
          setSelectCardTarget={setSelectCardTarget}
          currentRoom={currentRoom}
          setActiveCard={setActiveCard}
          activateCharacter={activateCharacter}
          username={username}
          currentPlayer={currentPlayer}
          duelActive={duelActive}
          indianiActive={indianiActive}
          discarding={discarding}
          character={character}
          nextTurn={nextTurn}
          characterUsable={characterUsable}
          myDrawChoice={myDrawChoice}
          emporioState={emporioState}
          myHealth={myHealth}
          selectPlayerTarget={selectPlayerTarget}
          setDiscarding={setDiscarding}
          playersLosingHealth={playersLosingHealth}
        />
        <Console />
      </div>
    </div>
  )
}

