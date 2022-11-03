import React, { useState } from 'react';
import Button from './Button';

export default function RoomCreate({ createRoom }) {
  
    const [roomInput, setRoomInput] = useState("");

    function handleClick() {
        createRoom(roomInput);
        setRoomInput("");
    }

    return (
    <div>
        <label className="text-outline font-rye text-5xl text-white mb-6">
            Create new room
        </label>
        <div className='mt-4'></div>
        <input
            className='shadow appearance-none font-rye text-xl rounded bg-beige m-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            placeholder="Room name..."
            onChange={(e) => setRoomInput(e.target.value)}
            value={roomInput}
        />
        <Button 
            onClick={handleClick}
            value={"Create new room"} 
        />
    </div>
  )
}
