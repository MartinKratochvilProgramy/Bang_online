import React from 'react'

export default function Player({ player, handleClick, playerStyles, selectPlayerTarget }) {
  return (
    <div key={player.name} style={playerStyles}>
        {player.name} {player.numberOfCards} {selectPlayerTarget ? <button onClick={handleClick}>Select</button> : null}
    </div>
  )
}
