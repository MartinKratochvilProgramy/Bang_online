import React from 'react'

export default function Mancato({ cardDigit, cardType, playMancato, isPlayable }) {

    let styles;
    if (isPlayable) {
      styles = {color: "red"}
    } 

  return (
    <button onClick={playMancato} style={styles}>
        Mancato! <br /> {cardDigit} {cardType}
    </button>
  )
}
