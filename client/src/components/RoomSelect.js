import React from 'react';
import './RoomSelect.css';
import UsernameSelect from './UsernameSelect';
import RoomCreate from './RoomCreate';
import RoomInfo from './RoomInfo';

export default function RoomSelect({ setUsername, socket, setCurrentRoom, username, rooms }) {

    const createRoom = (roomName) => {
        // don't allow already existing room to be created
        for (const room of rooms) {
        if (room.name === roomName) {
            return;
        }
        }
        
        socket.emit("create_room", roomName);

        // join room after create
        socket.emit("join_room", {currentRoom: roomName, username});
        setCurrentRoom(roomName);
        localStorage.setItem('room-name', JSON.stringify(roomName));
    }
  
    const joinRoom = (room) => {
        socket.emit("join_room", {currentRoom: room, username});
        setCurrentRoom(room);
        localStorage.setItem('room-name', JSON.stringify(room));
    };

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
      
              <h2 className='text-outline font-rye text-5xl text-white my-6'>
                  Join existing room
              </h2>
              <div className='grid justify-center items-center'>
                {rooms.map(room => {
                    return (
                        <RoomInfo room={room} joinRoom={() => joinRoom(room.name)} />
                        )
                    })}
              </div>

            <RoomCreate createRoom={createRoom} />
          </div>
        )

    }
}
