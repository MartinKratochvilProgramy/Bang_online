import React from 'react'

export default function Bang({ cardDigit, cardType, setSelectPlayerTarget }) {

    function playBang() {
        setSelectPlayerTarget(true);
    }

  return (
    <button onClick={playBang}>
        Bang! <br /> {cardDigit} {cardType}
    </button>
  )
}
