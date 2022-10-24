import React from 'react'

export default function Room({ users, roomName, leaveRoom }) {
  return (
    <div>
        <h1>{roomName}</h1>
        <button onClick={leaveRoom} >Disconnect</button>
        {users.map(user => {
            return (
                <div key={user.id}>
                    {user.username}
                </div>
            )
        })}
    </div>
  )
}
