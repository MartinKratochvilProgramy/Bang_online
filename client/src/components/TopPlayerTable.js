import React from 'react';
import getCharacterDescription from '../utils/getCharacterDescription';
import OponentCardOnTable from './OponentCardOnTable';

export default function TopPlayerTable({ socket, cardsInHand, table, oponentName, currentRoom, selectCardTarget, selectPlayerTarget, username, currentPlayer, 
     character, role, health, confirmCardTarget, playersInRange, confirmPlayerTarget}) {


  const characterSource = require("../img/gfx/characters/" + character.replace(/\s/g, '') + ".png");

  let roleSource;
  if (role === null || role === undefined) {
    roleSource = require("../img/gfx/roles/back-role.png");
  } else {
    console.log("REQ ROLE: ", role);
    roleSource = require("../img/gfx/roles/" + role + ".png");
  }

  let characterStyles = {};
  if (oponentName === currentPlayer || (playersInRange.includes(oponentName) && selectPlayerTarget)) {
    characterStyles = {color: "red", border: "solid 1px red", cursor: "pointer"};
  }

  function handleCharacterClick() {
    if (!playersInRange.includes(oponentName)) return;
    confirmPlayerTarget(oponentName);
  }

  return (
    <div className=''>
      <div 
        className='flex justify-between items-start mx-4 h-[145px] xs:h-[176px] bg-beige rounded p-2 relative'
      >
        <div className='flex w-auto min-w-[60px] xs:min-w-[80px] text-sm flex-col-reverse items-start font-rye'>
          <div className='flex flex-col items-start'>
            <div className='overflow-visible'>{oponentName}</div>
            <div>HP: {health}</div>
          </div>
          <div className='relative flex justify-center group'>
            <img 
              src={characterSource} 
              style={characterStyles} 
              onClick={() => handleCharacterClick()} 
              className='w-[60px] xs:w-[80px]  rounded-md ml-2 mr-4' alt="Player character">
            </img>
            <div className='hidden p-1 rounded group-hover:flex group-hover:flex-col group-hover:justify-center top-[96px] xs:top-[126px] w-[200px] mx-auto bg-transparentBlack text-white absolute'>
              <div className='text-xl'>
                {character} 
              </div>
              <div className='text-xs'>
                {getCharacterDescription(character)}
              </div>
            </div>
          </div>
        </div>

        <div className='flex w-auto min-w-[90px] relative group'>
          <img 
            className='w-[60px] xs:w-[80px]'
            src={roleSource} alt="">
          </img>
        </div>

        <div className='max-h-full w-full overflow-x-auto flex'>
          {cardsInHand.map(() => {
              return(
                <img
                  className='w-[60px] xs:w-[80px]' 
                  src={require("../img/gfx/cards/back-playing.png")} alt="" />
              )
          })}
        </div>
        
      </div>
      <div className='space-x-2 rotate-0 mt-2 flex justify-center z-20'>
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
    </div>
  )
}
