import React from 'react'

export default function Bang({ socket, cardDigit, cardType, setActiveCard, setSelectPlayerTarget, currentRoom, isPlayable, username }) {

    function handleClick() {
      setActiveCard({name: "Bang!", cardDigit, cardType});
      if (isPlayable) {
        setSelectPlayerTarget(true);
        socket.emit("request_players_in_range", {range: 1, currentRoom, username});
      }
    }

    let styles;
    if (isPlayable) {
      styles = {color: "red"}
    } 

  return (
    <button onClick={handleClick} style={styles}>
        Bang! <br /> {cardDigit} {cardType}
    </button>
  )
}
