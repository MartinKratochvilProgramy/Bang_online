import React from 'react';
import TopPlayerTable from './TopPlayerTable';

export default function Oponents({ socket, myHand, allPlayersInfo, currentRoom, activateCharacter, selectCardTarget, username, currentPlayer, 
    characterUsable, myHealth, confirmCardTarget}) {

    const oponentsInfo = allPlayersInfo.filter(player => {
        return (player.name !== username);
    });
    console.log("Oponents: ", oponentsInfo);

  return (
    <div>
        <TopPlayerTable
          socket={socket}
          cardsInHand={new Array(oponentsInfo[0].numberOfCards).fill(0)}
          table={oponentsInfo[0].table}
          oponentName={oponentsInfo[0].name}
          currentRoom={currentRoom}
          activateCharacter={activateCharacter}
          selectCardTarget={selectCardTarget}
          confirmCardTarget={confirmCardTarget}
          currentPlayer={currentPlayer}
          username={username}
          character={oponentsInfo[0].character}
          characterUsable={characterUsable}
          myHealth={myHealth}
        />
    </div>
  )
}
