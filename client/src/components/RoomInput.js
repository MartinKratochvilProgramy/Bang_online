import React from 'react'

export default function RoomInput({ usernameRef, setUsername, username, rooms, joinRoom }) {
  return (
    <div>
        <input
            placeholder="Username..."
            ref={usernameRef}
        />
        <button onClick={() => {setUsername(usernameRef.current.value)}}>Set username</button>
        <br/>
        Username:
        <div>
            {username}
        </div>
        <br/>
        Rooms:
        {rooms.map(room => {
            return (
            <button 
                key={room.roomId}
                id={room.roomId}
                onClick={joinRoom}
            >
                {room.roomId}
            </button>
            )
        })}
    </div>
  )
}
