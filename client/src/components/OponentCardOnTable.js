import React from 'react'

export default function OponentCardOnTable({ selectCardTarget, card, confirmCardTarget }) {

    let styles = {cursor: "auto"};
    if (selectCardTarget) {
      styles = {color: "red", border: "solid 1px red", cursor: "pointer"}
    } 


const cardSource = require("../img/gfx/cards/" + card.name.replace(/!/, '').replace(/\s/, '') + ".png");

  return (
    <button 
      onClick={() => confirmCardTarget(card.name, card.digit, card.type)} 
      style={styles} 
      className='w-[60px] xs:w-[80px]'>
      <img src={cardSource} alt="" />
        {/* {cardName} <br /> {cardDigit} {cardType} */}
    </button>
  )
}
