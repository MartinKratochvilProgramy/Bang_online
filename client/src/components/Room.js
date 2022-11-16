import React from 'react';
import Button from './Button';
import Chat from './Chat';

export default function Room({ users, messages, sendMessage, roomName, leaveRoom, startGame, admin }) {

  return (
    <div className=''>
        <div className='text-outline font-rye text-8xl text-white my-4'>{roomName}</div>
        <Button size={1.8} value={"Disconnect"} onClick={leaveRoom} />
        <div className='text-outline font-rye text-6xl text-white my-2'>Players ({users.length}/6)</div>
        <div className='flex flex-row space-x-2 xs:flex-col justify-center items-center'>
          {users.map((user) => {
            return (
              <div className='text-outline font-rye text-4xl text-white my-2'>{user.username}</div>
            )
          })}
        </div>
  
        {(admin && (users.length === 2 || (users.length >= 4  && users.length <= 6))) &&
          <Button onClick={() => startGame()} value={"Start game"} size={2} />
        }

        <div className='flex justify-center mt-8'>
          <Chat sendMessage={sendMessage} messages={messages} width={480} />
        </div>
    </div>
  )
}
