import React from 'react'

export default function CardOnTable({ socket, username, currentRoom, card }) {

      
    function playCardOnTable() {
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
    if (card.isPlayable) {
      styles = {color: "red", border: "solid 1px red", cursor: "pointer"}
    } 


const cardSource = require("../img/gfx/cards/" + card.name.replace(/!/, '').replace(/\s/, '') + ".png");

  return (
    <button 
      onClick={() => playCardOnTable()} 
      style={styles} 
      className='w-[80px]'>
      <img src={cardSource} alt="" />
        {/* {cardName} <br /> {cardDigit} {cardType} */}
    </button>
  )
}
