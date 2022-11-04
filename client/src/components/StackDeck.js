import React from 'react';
import Card from './Card';

export default function StackDeck({ socket, username, currentRoom, currentPlayer, topStackCard, character, characterUsable, drawFromDeck}) {
  return (
    <div>

      {topStackCard && 
        <Card 
            socket={socket}
            card={topStackCard}
            key={topStackCard.digit + topStackCard.type}
            currentRoom={currentRoom}
            username={username}
            currentPlayer={currentPlayer}
        />       
      }
      {((character === "Jesse Jones" || character === "Pedro Ramirez") && characterUsable) ? 
        <button onClick={() => drawFromDeck()} style={{color: "red"}} type="">Deck <br/>..</button>
        :
        <button  type="">Deck <br/>..</button>
      }
    </div>
  )
}
