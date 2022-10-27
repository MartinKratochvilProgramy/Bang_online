import React from 'react'

export default function Bang({ cardDigit, cardType, setActiveCard, setSelectPlayerTarget, isPlayable }) {

    function handleClick() {
      setActiveCard({name: "Bang!", cardDigit, cardType});
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
