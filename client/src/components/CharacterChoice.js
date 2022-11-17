import React from 'react'

export default function CharacterChoice({ socket, currentRoom, username, character, setCharacter, myCharacterChoice }) {

  function handleClick(card) {
    setCharacter(card);
    socket.emit("character_choice", {username, currentRoom, character: card})
  }

  
  return (
    <div>
      <div className='text-3xl xs:text-6xl font-rye my-6 text-white'>
        {character === "" ? "Pick a character" : "Waiting for other players..."}
      </div>
      <div className='flex justify-center space-x-4'>
        {myCharacterChoice.map((card) => {
          const characterSource = require("../img/gfx/characters/" + card.replace(/\s/g, '') + ".png");
          let styles;
          if (card === character) {
            styles = {border: "solid 2px red"}
          }
          return (
              <img 
                className='w-[185px] xs:w-[260px] rounded-3xl hover:shadow-2xl cursor-pointer'
                src={characterSource} 
                key={card}
                style={styles}
                alt="deck card"
                onClick={() => handleClick(card)} 
            />
          )
        })}
      </div>
    </div>
  )
}
