import React from 'react';
import getCharacterDescription from '../utils/getCharacterDescritption';
import CardOnTable from './CardOnTable';

export default function TopPlayerTable({ socket, cardsInHand, table, oponentName, currentRoom, activateCharacter, selectCardTarget, username, currentPlayer, 
     character, characterUsable, myHealth, confirmCardTarget}) {


  const characterSource = require("../img/gfx/characters/" + character.replace(/\s/, '') + ".png");

  let characterStyles = {};
  if (oponentName === currentPlayer) {
    characterStyles = {color: "red", border: "solid 1px red", cursor: "pointer"};
  }

  function handleCharacterClick() {
    if ((characterUsable && (character !== "Kit Carlson" || character === "Jesse Jones")) || (currentPlayer === username && (character === "Sid Ketchum"))) {
      activateCharacter()
    }
  }

  return (
    <div className='max-w-[900px] w-full rotate-180'>
      <div className='space-x-2 rotate-180 mb-2'>
        {table.map(card => {
          return(
            <CardOnTable 
              socket={socket}
              username={username}
              selectCardTarget={selectCardTarget}
              confirmCardTarget={confirmCardTarget}
              currentRoom={currentRoom}
              card={card}
            />
          )
        })}
      </div>
      <div 
        className='flex justify-between items-start mx-4 h-[260px] xl:h-[180px] bg-beige rounded p-2 relative rotate-180  '
      >
        <div className='flex flex-col-reverse items-start font-rye'>
          <div>{username}</div>
          <div>HP: {myHealth}</div>
          <div className='relative flex justify-center group'>
            <img src={characterSource} style={characterStyles} onClick={() => handleCharacterClick()} className='w-[80px] ml-2 mr-4' alt="Player character">
            </img>
            <div className='hidden p-1 rounded group-hover:flex group-hover:flex-col group-hover:justify-center top-[-76px] w-[200px] mx-auto bg-transparentBlack text-white absolute'>
              <div className='text-xl'>
                {character} 
              </div>
              <div className='text-xs'>
                {getCharacterDescription(character)}
              </div>
            </div>
          </div>

        </div>

        <div className='max-h-full w-full overflow-x-auto flex'>
          {cardsInHand.map(() => {
              return(
                // unknown card
                <img
                  className='w-[80px]' 
                  src={require("../img/gfx/cards/back-playing.png")} alt="" />
              )
          })}

        </div>

          <div className='flex flex-col justify-start h-full w-[120px] p-1 space-y-2'>

          </div>

      </div>
    </div>
  )
}
