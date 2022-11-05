import React from 'react';
import Card from './Card';

export default function StackDeck({ socket, username, currentRoom, currentPlayer, topStackCard, deckActive, drawFromDeck}) {
  console.log(topStackCard === null);

  function handleClick() {
    if (!deckActive) return;
    drawFromDeck();
  }

  let cardstyles = {};
  if (deckActive) {
    cardstyles = {border: "solid 1px red", cursor: "pointer"}
  }

  console.log("topStackCard ", topStackCard);
  
    return (
    <div className='flex space-x-4'>

        {topStackCard !== null && 
        <Card 
            socket={socket}
            card={topStackCard}
            key={topStackCard.digit + topStackCard.type}
            currentRoom={currentRoom}
            username={username}
            currentPlayer={currentPlayer}
        />       
        }
        <img 
            className='w-[60px] xs:w-[80px]'
            style={cardstyles}
            src={require("../img/gfx/cards/back-playing.png")} 
            alt="deck card"
            onClick={() => handleClick()} 
        />
    </div>
  )
}
