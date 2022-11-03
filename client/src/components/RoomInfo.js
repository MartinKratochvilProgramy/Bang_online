import React from 'react'
import Button from './Button'

export default function RoomInfo({ room, joinRoom }) {
  return (
    <div 
        className="bg-beige min-h-[55px] w-[420px] flex justify-between items-center space-x-2 rounded p-3 text-black font-rye text-sm leading-snug uppercase hover:shadow-xl focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-100 active:shadow-lg transition duration-150 ease-in-out dark:hover:bg-darkBeige"
        key={room.name}
        id={room.name}
        >
            <div className='flex space-x-2'>
                <div>
                    {room.name} 
                </div>
                <div className='text-gray-700'>
                    {room.numOfPlayers}/6
                </div>
            </div>
            {!room.gameActive ? 
                <Button onClick={joinRoom} value={"Join room"} size={1.5} />
            :
                <p className='text-gray-700'>
                    Game in progress...
                </p>
            }
            
    </div>
  )
}
