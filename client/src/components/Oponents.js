import React from 'react';
import TopPlayerTable from './TopPlayerTable';
import LeftPlayerTable from './LeftPlayerTable';
import RightPlayerTable from './RightPlayerTable';
import clamp from '../utils/clamp';

export default function Oponents({ socket, allPlayersInfo, currentRoom, activateCharacter, selectCardTarget, selectPlayerTarget, username, currentPlayer, 
    characterUsable, myHealth, confirmCardTarget, playersInRange, confirmPlayerTarget}) {
        
    const playerIndex = allPlayersInfo.findIndex(player => {
        return (player.name === username);
    });

    console.log(clamp(playerIndex + 0, allPlayersInfo.length - 1));
    console.log(clamp(playerIndex + 1, allPlayersInfo.length - 1));
    console.log(clamp(playerIndex + 2, allPlayersInfo.length - 1));

    
    const oponentsInfo = allPlayersInfo.filter(player => {
        return (player.name !== username);
    });
    console.log("oponentsInfo: ", oponentsInfo[0].table);


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

    if (oponentsInfo.length === 3) {
        return (
            <div className=''>
                <div className='fixed z-10 w-[590px] left-[-205px] xl:left-[-96px] top-[240px] xl:top-[200px]'>
                    <LeftPlayerTable
                        socket={socket}
                        cardsInHand={new Array(oponentsInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].numberOfCards).fill(0)}
                        table={oponentsInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].table}
                        oponentName={oponentsInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].name}
                        currentRoom={currentRoom}
                        activateCharacter={activateCharacter}
                        selectCardTarget={selectCardTarget}
                        selectPlayerTarget={selectPlayerTarget}
                        confirmCardTarget={confirmCardTarget}
                        currentPlayer={currentPlayer}
                        username={username}
                        character={oponentsInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].character}
                        characterUsable={characterUsable}
                        myHealth={myHealth}
                        playersInRange={playersInRange}
                        confirmPlayerTarget={confirmPlayerTarget}
                    />
                </div>
                <div className='min-w-[900px] w-full flex justify-center fixed top-0 left-0 right-0 mx-auto'>
                    <TopPlayerTable
                        socket={socket}
                        cardsInHand={new Array(oponentsInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].numberOfCards).fill(0)}
                        table={oponentsInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].table}
                        oponentName={oponentsInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].name}
                        currentRoom={currentRoom}
                        activateCharacter={activateCharacter}
                        selectCardTarget={selectCardTarget}
                        selectPlayerTarget={selectPlayerTarget}
                        confirmCardTarget={confirmCardTarget}
                        currentPlayer={currentPlayer}
                        username={username}
                        character={oponentsInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].character}
                        characterUsable={characterUsable}
                        myHealth={myHealth}
                        playersInRange={playersInRange}
                        confirmPlayerTarget={confirmPlayerTarget}
                    />
                </div>
                <div className='fixed w-[590px] right-[-205px] xl:right-[-166px] top-[240px] xl:top-[200px]'>
                    <RightPlayerTable
                        socket={socket}
                        cardsInHand={new Array(oponentsInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].numberOfCards).fill(0)}
                        table={oponentsInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].table}
                        oponentName={oponentsInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].name}
                        currentRoom={currentRoom}
                        activateCharacter={activateCharacter}
                        selectCardTarget={selectCardTarget}
                        selectPlayerTarget={selectPlayerTarget}
                        confirmCardTarget={confirmCardTarget}
                        currentPlayer={currentPlayer}
                        username={username}
                        character={oponentsInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].character}
                        characterUsable={characterUsable}
                        myHealth={myHealth}
                        playersInRange={playersInRange}
                        confirmPlayerTarget={confirmPlayerTarget}
                    />
                </div>
            </div>
        )
    }
}
