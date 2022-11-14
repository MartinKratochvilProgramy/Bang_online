import React from 'react'

export default function OponentCardOnTable({ selectCardTarget, card, confirmCardTarget }) {

    let styles = {cursor: "auto"};
    if (selectCardTarget) {
      styles = {color: "red", border: "solid 2px red", cursor: "pointer"}
    } 


const cardSource = require("../img/gfx/cards/" + card.name.replace(/!/, '').replace(/\s/, '').replace(/\./g, '') + ".png");

  return (
    <button 
      onClick={() => confirmCardTarget(card.name, card.digit, card.type)} 
      style={styles} 
      className='w-[60px] xs:w-[80px] rounded-md group flex flex-row justify-center'>
      <img src={cardSource} alt="" />
      <div className='hidden p-1 font-rye absolute rounded group-hover:flex group-hover:flex-col group-hover:justify-center translate-y-[-60px] bg-transparentBlack text-white'>
        <div className='text-xl'>
          {card.name} 
        </div>
        <div className='text-xs'>
          {card.digit} {card.type}
        </div>
      </div>
    </button>
  )
}
