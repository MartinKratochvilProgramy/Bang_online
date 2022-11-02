import React from 'react';
import './RoomSelect.css';
import Button from './Button';
import UsernameSelect from './UsernameSelect';

export default function RoomSelect({ newRoomRef, setUsername, createRoom, username, rooms, joinRoom }) {

    if (username === "") {
        return(
            <UsernameSelect setUsername={setUsername} />

        )
    } else {
        return (
          <div>
      
              <br/>
      
              <h2 className='text-outline font-rye text-6xl text-white mb-6'>
                  User: {username}
              </h2>
      
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
