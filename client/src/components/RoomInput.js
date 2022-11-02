import React from 'react';
import './RoomInput.css';

export default function RoomInput({ usernameRef, newRoomRef, setUsername, createRoom, username, rooms, joinRoom }) {
  return (
    <div>
        <h2 
            className='text-outline font-rye text-6xl text-white mb-6'>
            Select username:
        </h2>
        <input
            placeholder="Username..."
            ref={usernameRef}
        />
        <button 
            className=''
            onClick={() => {setUsername(usernameRef.current.value)}}>
            Set username
        </button>
        <br/>
        Username: {username}
        <h2>
            Create new room
        </h2>
        <input
            placeholder="Room name..."
            ref={newRoomRef}
        />
        <button onClick={() => {createRoom(newRoomRef.current.value)}}>Create room</button>
        <h2>
            Join existing room
        </h2>
        <br/>
        Rooms:
        {rooms.map(room => {
            return (
            <button 
                key={room}
                id={room}
                onClick={joinRoom}
            >
                {room}
            </button>
            )
        })}
    </div>
  )
}
