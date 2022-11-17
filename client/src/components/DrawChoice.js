import React from 'react'

export default function DrawChoice({ cards, getChoiceCard }) {
  return (
    <div 
        id="draw-choice" 
        className='flex flex-col justify-center w-[220px] xs:w-[350px] items-center bg-beige py-2 px-4 rounded'
    >
        <div className='text-black font-rye text-3xl'>
            Your draw choice:
        </div>
        <div className='flex space-x-2 xs:space-x-4'>
            {cards.map(card => {
                const cardSource = require("../img/gfx/cards/" + card.name.replace(/!/, '').replace(/\s/, '').replace(/\./g, '') + ".png");
                return (
                    <button 
                        onClick={() => getChoiceCard(card)} 
                        style={{color: "red", border: "solid 2px red", cursor: "pointer"}}
                        className='w-[60px] xs:w-[80px] rounded-md'>
                        <img src={cardSource} alt="" />
                    </button>
                )
            })}
        </div>
    </div>
  )
}
