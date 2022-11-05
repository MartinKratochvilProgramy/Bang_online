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
      styles = {color: "red", border: "solid 1px red", cursor: "pointer"}
    } 


const cardSource = require("../img/gfx/cards/" + card.name.replace(/!/, '').replace(/\s/, '') + ".png");

  return (
    <button 
      onClick={() => playCardOnTable()} 
      style={styles} 
      className='w-[60px] xs:w-[80px]'>
      <img src={cardSource} alt="" />
        {/* {cardName} <br /> {cardDigit} {cardType} */}
    </button>
  )
}
