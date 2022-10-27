import React from 'react'

export default function Bang({ cardDigit, cardType, setSelectPlayerTarget, isPlayable }) {

    function playBang() {
        setSelectPlayerTarget(true);
    }

    let styles;
    if (isPlayable) {
      styles = {color: "red"}
    } 

  return (
    <button onClick={playBang} style={styles}>
        Bang! <br /> {cardDigit} {cardType}
    </button>
  )
}
