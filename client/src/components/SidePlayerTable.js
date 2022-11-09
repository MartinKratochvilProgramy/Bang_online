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
    characterStyles = {color: "red", border: "solid 2px red"};
  }

  function handleCharacterClick() {
    if (!playersInRange.includes(oponentName)) return;
    confirmPlayerTarget(oponentName);
  }

  return (
    <div className='w-[300px] xs:w-full absolute z-50'>
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
        <div className='flex w-auto min-w-[60px] xs:min-w-[80px] text-sm flex-col items-start font-rye'>
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

        <div className='flex w-auto min-w-[70px] xs:min-w-[90px] relative group'>
          <img 
            className='w-[60px] xs:w-[80px]'
            src={roleSource} alt="">
          </img>
        </div>

        <div id='cards' className='max-h-full w-full flex justify-center'>
          <div className='max-h-full w-[272px] flex relative'>
            {cardsInHand.map((card, index) => {
                let translate = 0;
                let magicConstant = 72;
                let cardWidth = 60;
                if (document.getElementById('cards') !== null) {
                  document.getElementById('cards').offsetWidth > 260 ? magicConstant = 262 : magicConstant = 112;
                  document.getElementById('cards').offsetWidth > 260 ? cardWidth = 90 : cardWidth = 60;
                }
                if (cardsInHand.length > 3) {
                    translate = - ((cardsInHand.length) * cardWidth - magicConstant) / (cardsInHand.length - 1) * index;
                }
                return(
                  // unknown card
                  <img
                    style={{transform: `translate(${translate}px, 0)`}}
                    className='w-[60px] xs:w-[80px] translate-x-[-40px]' 
                    src={require("../img/gfx/cards/back-playing.png")} alt="" />
                )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
