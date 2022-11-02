import React from 'react'

export default function RoomCreate() {
  return (
    <div>
        <h2>
            Create new room
        </h2>
        <input
            placeholder="Room name..."
            ref={newRoomRef}
        />
        <Button 
            onClick={() => {createRoom(newRoomRef.current.value)}}
            value={"Create new room"} 
        />
    </div>
  )
}
