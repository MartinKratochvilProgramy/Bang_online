import React from 'react'

export default function EmporionChoice({ cards, getEmporioCard, username, nextEmporioTurn }) {
  
    let emporioStyles = {color: "black"};
    if (nextEmporioTurn === username) {
        emporioStyles = {border: "solid 2px red"}
    }
  
    return (
    <div 
        id="draw-choice" 
        className='flex flex-col justify-center items-center bg-beige py-2 px-4 rounded'
    >
        <div className='text-black font-rye text-3xl'>
            Emporio:
        </div>
        <div className='flex space-x-2 xs:space-x-4'>
            {cards.map(card => {
                const cardSource = require("../img/gfx/cards/" + card.name.replace(/!/, '').replace(/\s/, '').replace(/\./g, '') + ".png");
                return (
                    <button 
                        onClick={() => getEmporioCard(card)} 
                        style={emporioStyles}
                        className='w-[60px] xs:w-[80px] rounded-md'>
                        <img src={cardSource} alt="" />
                    </button>
                )
            })}
        </div>
    </div>
  )
}
