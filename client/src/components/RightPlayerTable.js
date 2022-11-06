import React from 'react';
import getCharacterDescription from '../utils/getCharacterDescritption';
import OponentCardOnTable from './OponentCardOnTable';

export default function RightPlayerTable({ socket, cardsInHand, table, oponentName, currentRoom, selectCardTarget, selectPlayerTarget, username, currentPlayer, 
     character, health, confirmCardTarget, playersInRange, confirmPlayerTarget}) {


  const characterSource = require("../img/gfx/characters/" + character.replace(/\s/, '') + ".png");

  let characterStyles = {};
  if (oponentName === currentPlayer || (playersInRange.includes(oponentName) && selectPlayerTarget)) {
    characterStyles = {color: "red", border: "solid 1px red", cursor: "pointer"};
  }

  console.log(table);

  function handleCharacterClick() {
    confirmPlayerTarget(oponentName);
  }

  return (
    <div className='w-[300px] xs:w-[400px]'>
      <div id='table' className='space-x-2 flex justify-center mb-1 xs:mb-2 translate-y-[0] xs:translate-y-[-5px]'>
        {table.map(card => {
          return(
            <OponentCardOnTable 
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
        className='flex justify-between items-end mx-4 h-[145px] xs:h-[176px] bg-beige rounded p-2 relative'
      >
        <div className='flex w-[100px] text-sm flex-col items-start font-rye'>
          <div className='overflow-visible'>{oponentName}</div>
          <div>HP: {health}</div>
          <div className='relative flex justify-center group'>
            <img 
              src={characterSource} 
              style={characterStyles} 
              onClick={() => handleCharacterClick()} 
              className='w-[60px] xs:w-[80px] ml-2 mr-4' 
              alt="Player character">
            </img>
            <div className='hidden p-1 rotate-[90deg] rounded group-hover:flex group-hover:flex-col group-hover:justify-center top-[-146px] w-[200px] mx-auto bg-transparentBlack text-white absolute'>
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
                  className='w-[60px] xs:w-[80px]' 
                  src={require("../img/gfx/cards/back-playing.png")} alt="" />
              )
          })}

        </div>

      </div>
    </div>
  )
}
