import React from 'react'

export default function Mancato({ socket, cardDigit, cardType, isPlayable, username, currentRoom }) {

    let styles;
    if (isPlayable) {
      styles = {color: "red"}
    } 
    
    function handleClick() {
      if (!isPlayable) return;
      socket.emit("play_mancato", {username, currentRoom, cardDigit, cardType});
    }

  return (
    <button onClick={handleClick} style={styles}>
        Mancato! <br /> {cardDigit} {cardType}
    </button>
  )
}
