import React from 'react';
import Card from './Card';
import Button from './Button';

export default function PlayerTable({ socket, myHand, setSelectPlayerTarget, setSelectCardTarget, currentRoom, setActiveCard, username, currentPlayer, duelActive, 
    indianiActive, discarding, character, nextTurn, characterUsable, myDrawChoice, emporioState, myHealth,
    selectPlayerTarget, setDiscarding, playersLosingHealth}) {

        
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

  return (
    <div className='flex justify-center items-center mx-4 max-w-[900px] w-full h-[160px] bg-beige rounded p-2 relative'>

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

        <div className='absolute flex flex-col w-[120px] top-0 right-0 pt-1 pr-1 space-y-2'>
          {(currentPlayer === username && nextTurn && !characterUsable && emporioState.length === 0 && !(myDrawChoice.length > 0)) && <Button onClick={endTurn} value={"End turn"} size={1.2} />}
          {(selectPlayerTarget && currentPlayer === username) && <Button onClick={cancelTargetSelect} value={"Cancel"} size={1.2} /> }
          {discarding && <Button onClick={() => setDiscarding(false)} value={"Cancel"} size={1.2} />}
        </div>
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
