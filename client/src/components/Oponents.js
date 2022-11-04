import React from 'react';
import TopPlayerTable from './TopPlayerTable';

export default function Oponents({ socket, allPlayersInfo, currentRoom, activateCharacter, selectCardTarget, selectPlayerTarget, username, currentPlayer, 
    characterUsable, myHealth, confirmCardTarget, playersInRange, confirmPlayerTarget}) {

    const oponentsInfo = allPlayersInfo.filter(player => {
        return (player.name !== username);
    });
    console.log("Oponents: ", oponentsInfo);

    if (oponentsInfo.length === 1) {
        return (
          <div className='min-w-[900px] w-full'>
              <TopPlayerTable
                socket={socket}
                cardsInHand={new Array(oponentsInfo[0].numberOfCards).fill(0)}
                table={oponentsInfo[0].table}
                oponentName={oponentsInfo[0].name}
                currentRoom={currentRoom}
                activateCharacter={activateCharacter}
                selectCardTarget={selectCardTarget}
                selectPlayerTarget={selectPlayerTarget}
                confirmCardTarget={confirmCardTarget}
                currentPlayer={currentPlayer}
                username={username}
                character={oponentsInfo[0].character}
                characterUsable={characterUsable}
                myHealth={myHealth}
                playersInRange={playersInRange}
                confirmPlayerTarget={confirmPlayerTarget}
              />
          </div>
        )
    }

    if (oponentsInfo.length === 2) {
        return (
          <div className='min-w-[900px] w-full flex'>
              <TopPlayerTable
                socket={socket}
                cardsInHand={new Array(oponentsInfo[0].numberOfCards).fill(0)}
                table={oponentsInfo[0].table}
                oponentName={oponentsInfo[0].name}
                currentRoom={currentRoom}
                activateCharacter={activateCharacter}
                selectCardTarget={selectCardTarget}
                selectPlayerTarget={selectPlayerTarget}
                confirmCardTarget={confirmCardTarget}
                currentPlayer={currentPlayer}
                username={username}
                character={oponentsInfo[0].character}
                characterUsable={characterUsable}
                myHealth={myHealth}
                playersInRange={playersInRange}
                confirmPlayerTarget={confirmPlayerTarget}
              />
          </div>
        )
    }
}
