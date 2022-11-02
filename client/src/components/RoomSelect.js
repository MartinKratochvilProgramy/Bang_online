import React from 'react';
import './RoomSelect.css';
import UsernameSelect from './UsernameSelect';
import RoomCreate from './RoomCreate';

export default function RoomSelect({ newRoomRef, setUsername, createRoom, username, rooms, joinRoom }) {

    if (username === "") {
        return(
            <UsernameSelect setUsername={setUsername} />

        )
    } else {
        return (
          <div>
              <h2 className='text-outline font-rye text-8xl text-white mb-6'>
                  {username}
              </h2>
                <RoomCreate createRoom={createRoom} />
      
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
}
