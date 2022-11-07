import React from 'react';
import getCharacterDescription from '../utils/getCharacterDescription';
import OponentCardOnTable from './OponentCardOnTable';

export default function SidePlayerTable({ socket, cardsInHand, table, oponentName, currentRoom, selectCardTarget, selectPlayerTarget, username, currentPlayer, 
     character, role, health, confirmCardTarget, playersInRange, confirmPlayerTarget, rotateDescription }) {

  console.log("role: ", role);

  const characterSource = require("../img/gfx/characters/" + character.replace(/\s/g, '') + ".png");

  let roleSource;
  if (role === null) {
    roleSource = require("../img/gfx/roles/back-role.png");
  } else {
    roleSource = require("../img/gfx/roles/" + role + ".png");
  }

  let characterStyles = {};
  if (oponentName === currentPlayer || (playersInRange.includes(oponentName) && selectPlayerTarget)) {
    characterStyles = {color: "red", border: "solid 1px red", cursor: "pointer"};
  }

  function handleCharacterClick() {
    confirmPlayerTarget(oponentName);
  }

  return (
    <div className='w-[300px] xs:w-[400px] absolute z-50'>
      <div className='space-x-2 flex justify-center mb-1 xs:mb-2 translate-y-[0] xs:translate-y-[-px]'>
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
        <div className='flex w-[140px] text-sm flex-col items-start font-rye'>
          <div className='overflow-visible'>{oponentName}</div>
          <div>HP: {health}</div>
          <div className='relative flex justify-center group'>
            <img 
              src={characterSource} 
              style={characterStyles} 
              onClick={() => handleCharacterClick()} 
              className='w-[60px] xs:w-[80px] rounded-md ml-2 mr-4' 
              alt="Player character">
            </img>
            <div 
              style={{rotate: `${rotateDescription}deg`}}
              className={`hidden p-1 z-10 rounded group-hover:flex group-hover:flex-col group-hover:justify-center top-[-146px] w-[200px] mx-auto bg-transparentBlack text-white absolute`}>
              <div className='text-xl'>
                {character} 
              </div>
              <div className='text-xs'>
                {getCharacterDescription(character)}
              </div>
            </div>
          </div>
        </div>

        <div className='flex w-[140px] relative group'>
          <img 
            className='w-[60px] xs:w-[80px]'
            src={roleSource} alt="">
          </img>
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
