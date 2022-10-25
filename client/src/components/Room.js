import React, { useState } from 'react';

export default function Room({ users, messages, roomName, leaveRoom, sendMessage, getDeck }) {
  const [messageInput, setMessageInput] = useState("");

  return (
    <div>
        <h1>{roomName}</h1>
        <button onClick={leaveRoom} >Disconnect</button>
        <h2>Users</h2>
        {users.map(user => {
            return (
                <div key={user.id}>
                    {user.username}
                </div>
            )
        })}

        <h2>Messages</h2>
        <form onSubmit={(e) =>{
          e.preventDefault();
          setMessageInput("");
          sendMessage(messageInput);
        }}>
          <label>
            Send message:
            <input 
              placeholder="Submit"
              autoFocus
              onChange={(e) => setMessageInput(e.target.value)} 
              value={messageInput} />
            <button type="submit">Send</button>
          </label>
        </form>

        {messages.map(message => {
            return (
                <div key={message.id}>
                    {message.username}: {message.message}
                </div>
            )
        })}
        <button onClick={() => getDeck()}>Read deck</button>
    </div>
  )
}
