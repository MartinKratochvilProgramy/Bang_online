import React, { useEffect } from 'react';

export default function Game({ socket, username, roomName }) {
  useEffect(() => {
    socket.on("game_started", data => {
      console.log(data);
      // socket.emit("get_my_hand", {username, roomName});
    })

    // socket.on("my_hand", hand => {
    //   console.log("my hand: ", hand);
    // })
  
  }, [socket]);
  
  
  return (
    <div>

      GAME

    </div>
  )
}
