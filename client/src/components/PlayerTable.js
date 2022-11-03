import React, { useRef, useEffect } from 'react';
import Card from './Card';
import Button from './Button';

export default function PlayerTable({ socket, myHand, setSelectPlayerTarget, setSelectCardTarget, currentRoom, setActiveCard, username, currentPlayer, duelActive, 
    indianiActive, discarding, character, nextTurn, characterUsable, myDrawChoice, emporioState, myHealth,
    selectPlayerTarget, setDiscarding, playersLosingHealth}) {

  const tableRef = useRef(null);

  useEffect( () => {

    // The 'current' property contains info of the reference:
    // align, title, ... , width, height, etc.
    console.log("Canvas: ", tableRef.current.parentElement.offsetWidth);
}, [tableRef]);

  function cancelTargetSelect() {
    setSelectPlayerTarget(false);
    setSelectCardTarget(false);
    setActiveCard({});
  }
  
  function loseHealth() {
    socket.emit("lose_health", {username, currentRoom})
  }

  function endTurn() {
    if (myHand.length > myHealth) {
      setDiscarding(true);
    } else {
      setDiscarding(false);
      setSelectPlayerTarget(false);
      setSelectCardTarget(false);
      socket.emit("end_turn", currentRoom);
    }
  }

  const characterSource = require("../img/gfx/characters/" + character.replace(/\s/, '') + ".png");

  return (
    <div 
      className='flex justify-between items-center mx-4 max-w-[900px] w-full h-[280px] xl:h-[160px] bg-beige rounded p-2 relative'
      ref={tableRef}>

      <img src={characterSource} className='w-[80px] mr-4' alt="Player character" />

      <div className='max-h-full w-full overflow-auto'>
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

      </div>

        <div className='flex flex-col justify-start h-full w-[120px] p-1 space-y-2'>
          {(currentPlayer === username && nextTurn && !characterUsable && emporioState.length === 0 && !(myDrawChoice.length > 0)) && <Button onClick={endTurn} value={"End turn"} size={1.2} />}
          {(selectPlayerTarget && currentPlayer === username) && <Button onClick={cancelTargetSelect} value={"Cancel"} size={1.2} /> }
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
  )
}
