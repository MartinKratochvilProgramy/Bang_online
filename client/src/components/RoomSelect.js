import React from 'react';
import './RoomSelect.css';
import UsernameSelect from './UsernameSelect';
import RoomCreate from './RoomCreate';

export default function RoomSelect({ setUsername, createRoom, username, rooms, joinRoom }) {

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
      
              <h2 className='text-outline font-rye text-5xl text-white mb-6'>
                  Join existing room
              </h2>
              <br/>
              Rooms:
              {rooms.map(room => {
                console.log("Room: ", room);
                  return (
                  <button 
                      key={room.name}
                      id={room.name}
                      onClick={joinRoom}
                  >
                      {room.name}
                  </button>
                  )
              })}
          </div>
        )

    }
}
