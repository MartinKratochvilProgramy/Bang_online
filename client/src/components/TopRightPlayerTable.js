import React from 'react';
import getCharacterDescription from '../utils/getCharacterDescription';
import OponentCardOnTable from './OponentCardOnTable';

export default function TopLeftPlayerTable({ socket, cardsInHand, table, oponentName, currentRoom, selectCardTarget, selectPlayerTarget, username, currentPlayer, 
     character, role, health, confirmCardTarget, playersInRange, confirmPlayerTarget, largeMagicConstant, smallMagicConstant, cardClampLimit }) {

      console.log("character ", character);


  const characterSource = require("../img/gfx/characters/" + character.replace(/\s/g, '') + ".png");

  let roleSource;
  if (role === null || role === undefined) {
    roleSource = require("../img/gfx/roles/back-role.png");
  } else {
    roleSource = require("../img/gfx/roles/" + role + ".png");
  }

  let characterStyles = {};
  if (oponentName === currentPlayer || (playersInRange.includes(oponentName) && selectPlayerTarget)) {
    characterStyles = {color: "red", border: "solid 2px red", cursor: "pointer"};
  }

  function handleCharacterClick() {
    if (!playersInRange.includes(oponentName)) return;
    confirmPlayerTarget(oponentName);
  }

  return (
    <div className='relative'>
      <div 
        className='flex justify-start items-start h-[135px] xs:h-[176px] bg-beige rounded p-2'
      >
        <div className='flex z-20 w-auto min-w-[60px] xs:min-w-[80px] text-xs xs:text-sm flex-col-reverse items-start font-rye'>
          <div className='flex flex-col items-start'>
            <div className='overflow-visible'>{oponentName}</div>
            <div>HP: {health}</div>
          </div>
          <div className='flex justify-center group'>
            <img 
              src={characterSource} 
              style={characterStyles} 
              onClick={() => handleCharacterClick()} 
              className='w-[60px] xs:w-[80px]  rounded-md mr-2' alt="Player character">
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

        <div className='flex justify-start xs:justify-center w-auto min-w-[90px] group'>
          <img 
            className='w-[60px] xs:w-[80px]'
            src={roleSource} alt="">
          </img>
        </div>

        <div id='top-cards' className='w-full flex justify-center'>
          <div className='max-h-full w-[240px] xs:w-[320px] flex relative'>
            {cardsInHand.map((card, index) => {
                let translate = 0;
                let magicConstant = 222;
                let cardWidth = 60;
                if (document.getElementById('top-cards') !== null) {
                  document.getElementById('top-cards').offsetWidth > 260 ? magicConstant = largeMagicConstant : magicConstant = smallMagicConstant;
                  document.getElementById('top-cards').offsetWidth > 260 ? cardWidth = 90 : cardWidth = 60;
                }
                if (cardsInHand.length >= cardClampLimit) {
                    translate = - ((cardsInHand.length) * cardWidth - magicConstant) / (cardsInHand.length - 1) * index;
                }
                return(
                  <img
                    key={index}
                    className='w-[60px] xs:w-[80px]' 
                    style={{transform: `translate(${translate}px, 0)`}}
                    src={require("../img/gfx/cards/back-playing.png")} alt="" />
                )
            })}
          </div>
        </div>

        
      </div>
      <div className='space-x-2 absolute left-[0%] translate-x-[-0%] rotate-0 mt-1 xs:mt-2 flex justify-center'>
        {table.map(card => {
          return(
            <OponentCardOnTable 
              socket={socket}
              username={username}
              selectCardTarget={selectCardTarget && playersInRange.includes(oponentName)}
              confirmCardTarget={confirmCardTarget}
              currentRoom={currentRoom}
              key={card.name + card.digit + card.type}
              card={card}
            />
          )
        })}
      </div>
    </div>
  )
}
