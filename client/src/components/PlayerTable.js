import React from 'react';
import Card from './Card';
import Button from './Button';
import getCharacterDescription from '../utils/getCharacterDescription';
import getRoleDescription from '../utils/getRoleDescription';
import CardOnTable from './CardOnTable';

export default function PlayerTable({ socket, myHand, table, setSelectPlayerTarget, setSelectCardTarget, currentRoom, setActiveCard, activateCharacter, username, currentPlayer, duelActive, 
    indianiActive, discarding, character, role, nextTurn, characterUsable, setCharacterUsable, myDrawChoice, emporioState, myHealth,
    selectPlayerTarget, setDiscarding, setDeckActive, playersLosingHealth}) {

  function cancelTargetSelect() {
    setSelectPlayerTarget(false);
    setSelectCardTarget(false);
    setActiveCard({});
  }
  
  function loseHealth() {
    setCharacterUsable(false);
    socket.emit("lose_health", {username, currentRoom})
  }

  function endTurn() {
    if (myHand.length > myHealth) {
      setDiscarding(true);
      setSelectPlayerTarget(false);
      setSelectCardTarget(false);
      setDeckActive(false);
    } else {
      setDiscarding(false);
      setSelectPlayerTarget(false);
      setSelectCardTarget(false);
      setDeckActive(false);
      socket.emit("end_turn", currentRoom);
    }
  }

  const characterSource = require("../img/gfx/characters/" + character.replace(/\s/g, '') + ".png");
  // after character choice th client sends req to server to get random role
  // while waiting for the role, it is "", so require() would not load
  // this is hacky, I'm sorry
  let roleSource;
  if (role !== ""  && role !== undefined && role !== null) {
    roleSource = require("../img/gfx/roles/" + role + ".png");
  }

  let characterStyles = {};
  if ((characterUsable && (character !== "Kit Carlson" || character === "Jesse Jones")) || (currentPlayer === username && (character === "Sid Ketchum") && nextTurn)) {
    characterStyles = {color: "red", border: "solid 2px red", cursor: "pointer"};
  }

  function handleCharacterClick() {
    if ((characterUsable && (character !== "Kit Carlson" || character === "Jesse Jones")) || (currentPlayer === username && (character === "Sid Ketchum") && nextTurn)) {
      activateCharacter()
    }
  }

  return (
    <div className='relative max-w-[600px] xs:max-w-[900px] w-full'>
      <div className='absolute mb-1 xs:mb-2 space-x-2 flex justify-center left-[50%] translate-x-[-50%] translate-y-[-94px] xs:translate-y-[-130px]'>
        {table.map(card => {
          return(
            <CardOnTable 
              socket={socket}
              username={username}
              currentRoom={currentRoom}
              card={card}
            />
          )
        })}
      </div>
      <div 
        className='flex justify-between items-end mx-4 h-[135px] xs:h-[176px] bg-beige rounded p-2 pt-3 relative font-rye'
      >
        <div className='flex min-w-[60px] xs:min-w-[80px] flex-col text-xs xs:text-sm items-start'>
          <div className='flex flex-col justify-start items-start'>
            <div className='overflow-hidden '>{username}</div>
            <div className=''>HP: {myHealth}</div>
          </div>
          <div className='relative group'>
            <img 
              src={characterSource} 
              style={characterStyles} 
              onClick={() => handleCharacterClick()} 
              className='w-[60px] xs:w-[80px] rounded-md mr-4' alt="Player character">
            </img>
            <div className='hidden p-1 rounded group-hover:flex group-hover:flex-col group-hover:justify-center top-[-86px] left-[-60px] w-[200px] mx-auto bg-transparentBlack text-white absolute'>
              <div className='text-xl'>
                {character} 
              </div>
              <div className='text-xs'>
                {getCharacterDescription(character)}
              </div>
            </div>
          </div>
        </div>

        {role !== "" && 
          <div className='flex w-[120px] relative group'>
            <img 
              className='w-[60px] xs:w-[80px]'
              src={roleSource} alt="">
            </img>
            <div className='hidden p-1 rounded group-hover:flex group-hover:flex-col group-hover:justify-center top-[-70px] left-[-40px] w-[160px] mx-auto bg-transparentBlack text-white absolute'>
                <div className='text-xl'>
                  {role} 
                </div>
                <div className='text-xs'>
                  {getRoleDescription(role)}
                </div>
              </div>
          </div>
        }

        <div className='max-h-full w-full overflow-y-auto flex flex-wrap justify-center'>
          {myHand.map(card => {
              return(
              <Card 
                  socket={socket}
                  card={card}
                  key={card.name + card.digit + card.type}
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

        </div>

          <div className='flex flex-col justify-start h-full w-[120px] px-1 py-0 space-y-2'>
            {(currentPlayer === username && nextTurn && !characterUsable && emporioState.length === 0 && !(myDrawChoice.length > 0)) && <Button onClick={endTurn} value={"End turn"} size={1.2} />}
            {(selectPlayerTarget && nextTurn && currentPlayer === username) && <Button onClick={cancelTargetSelect} value={"Cancel"} size={1.2} /> }
            {discarding && <Button onClick={() => setDiscarding(false)} value={"Cancel"} size={1.2} />}
            {playersLosingHealth.map((player) => {
                if (player.name === username && player.isLosingHealth) {
                return (
                    <Button key={player.name} onClick={loseHealth} value={"Lose health"} size={1.2} />
                )
                }
                return (null)
            })}
          </div>

      </div>
    </div>
  )
}
