import React from 'react'

export default function Bang({ socket, cardDigit, cardType, setActiveCard, setSelectPlayerTarget, isPlayable }) {

    function handleClick() {
      setActiveCard({cardDigit, cardType});
      if (isPlayable) {
        setSelectPlayerTarget(true);
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
