import React from 'react'

export default function CardOnTable({ socket, username, selectCardTarget, currentRoom, card, confirmCardTarget }) {

      
    function playCardOnTable() {
        if (selectCardTarget) {
          confirmCardTarget(card.name, card.digit, card.type)
        }
        if (!card.isPlayable) return;
        if (card.name === "Barilo") {
        socket.emit("use_barel", {username, currentRoom});
        }
        if (card.name === "Dynamite") {
        socket.emit("use_dynamite", {username, currentRoom, card});
        }
        if (card.name === "Prigione") {
        socket.emit("use_prigione", {username, currentRoom, card});
        }
    }

    let styles = {cursor: "auto"};
    if (card.isPlayable || selectCardTarget) {
      styles = {color: "red", border: "solid 2px red", cursor: "pointer"}
    } 


const cardSource = require("../img/gfx/cards/" + card.name.replace(/!/, '').replace(/\s/, '').replace(/\./g, '') + ".png");

  return (
    <button 
      onClick={() => playCardOnTable()} 
      style={styles} 
      className='w-[60px] xs:w-[80px] rounded-md group flex flex-row justify-center'>
      <img src={cardSource} alt="" />
      <div className='hidden p-1 z-40 font-rye absolute rounded group-hover:flex group-hover:flex-col group-hover:justify-center translate-y-[-60px] bg-transparentBlack text-white'>
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
