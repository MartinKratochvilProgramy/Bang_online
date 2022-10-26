import React, { useEffect } from 'react'

export default function Game({ socket }) {
  useEffect(() => {
    socket.on("game_started", data => {
      console.log(data);
    })
  
  }, [])
  
  
  return (
    <div>

      GAME

    </div>
  )
}
