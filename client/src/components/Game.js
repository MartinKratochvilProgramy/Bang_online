import React, { useEffect, useState } from 'react';
import PlayerTable from './PlayerTable';
import Oponents from './Oponents';
import Chat from './Chat';
import Console from './Console';
import StackDeck from './StackDeck';
import DrawChoice from './DrawChoice';
import EmporionChoice from './EmporionChoice';
import CharacterChoice from './CharacterChoice';
import GameEnd from './GameEnd';

export default function Game({ myCharacterChoice, characterChoiceInProgress, setCharacter, myHand, allPlayersInfo, username, character, role, knownRoles, socket, currentRoom, setCurrentRoom, currentPlayer, playersLosingHealth, playersActionRequiredOnStart, topStackCard, duelActive, 
  indianiActive, emporioState, myDrawChoice, nextEmporioTurn, sendMessage, messages, consoleOutput, winner }) { 
  
  const [characterUsable, setCharacterUsable] = useState(false);
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
        if (character !== "Pedro Ramirez") {
          setCharacterUsable(false);
        }
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
        console.log("char usable");
        setDeckActive(true);
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
    if (username !== nextEmporioTurn) return;
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
      setSelectPlayerTarget(false);
      setDeckActive(false);
      setNextTurn(true);
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
    setNextTurn(true);
  }

  console.log("Next turn", nextTurn);
  
  return (
    <div id='game'>
      {characterChoiceInProgress ? 
        <div 
          className='fixed flex flex-col items-center justify-center top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] m-auto'
          id="character-choice">
          <CharacterChoice 
            socket={socket} 
            currentRoom={currentRoom}
            username={username} 
            character={character}
            setCharacter={setCharacter} 
            myCharacterChoice={myCharacterChoice} /> 
          <Chat sendMessage={sendMessage} messages={messages} width={260} />
        </div>
      : 
        <>
          <Oponents
            socket={socket}
            myHand={myHand}
            allPlayersInfo={allPlayersInfo}
            knownRoles={knownRoles}
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

          <div className='fixed flex justify-center items-center z-30 top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] m-auto'>
            <StackDeck 
              socket={socket} 
              username={username} 
              currentRoom={currentRoom} 
              currentPlayer={currentPlayer}
              topStackCard={topStackCard}
              deckActive={deckActive}
              drawFromDeck={drawFromDeck}
            />
            <div className='absolute top-1/2 translate-y-[-50%]'>
              {myDrawChoice.length > 0 && <DrawChoice cards={myDrawChoice} getChoiceCard={getChoiceCard} />}
            </div>
            <div className='absolute mt-8'>
              {emporioState.length > 0 && <EmporionChoice cards={emporioState} getEmporioCard={getEmporioCard} username={username} nextEmporioTurn={nextEmporioTurn} />}
            </div>
            <div className='absolute flex mt-8 min-w-[400px]'>
              {winner && <GameEnd winner={winner} setCurrentRoom={setCurrentRoom} />}
            </div>
          </div>

          <div className='fixed flex justify-between items-end bottom-0 left-0 right-0 z-40'>
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
              role={role}
              nextTurn={nextTurn}
              characterUsable={characterUsable}
              setCharacterUsable={setCharacterUsable}
              myDrawChoice={myDrawChoice}
              emporioState={emporioState}
              myHealth={myHealth}
              selectPlayerTarget={selectPlayerTarget}
              setDiscarding={setDiscarding}
              setDeckActive={setDeckActive}
              playersLosingHealth={playersLosingHealth}
            />
            <Console socket={socket} consoleOutput={consoleOutput} />
          </div>
        </>
      }
    </div>
  )
}

