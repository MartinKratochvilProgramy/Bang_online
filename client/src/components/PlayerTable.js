import React from 'react';
import Card from './Card';

export default function PlayerTable({ socket, myHand, setSelectPlayerTarget, setSelectCardTarget, currentRoom, setActiveCard, username, currentPlayer, duelActive, indianiActive, discarding, character}) {
  return (
    <div className='w-[260px] h-[260px] bg-beige'>

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
  )
}
