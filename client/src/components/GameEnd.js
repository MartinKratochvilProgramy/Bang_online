import React from 'react'
import Button from './Button'

export default function GameEnd({ winner, setCurrentRoom }) {
  return (
    <div 
        id="game-end" 
        className='flex flex-col justify-center w-full xs:w-[350px] items-center bg-beige py-2 px-4 rounded'
    >
        <div className='text-black p-4 space-y-4 flex flex-col font-rye text-3xl'>
            <div>
                GAME OVER!
            </div>
            <div>
                {winner}
            </div>
            <div>
                <Button value={'LEAVE ROOM'} onClick={() => window.location.reload()} size={2} />
            </div>
        </div>

    </div>
  )
}
