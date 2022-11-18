import React from 'react';
import TopPlayerTable from './TopPlayerTable';
import TopLeftPlayerTable from './TopLeftPlayerTable';
import TopRightPlayerTable from './TopRightPlayerTable';
import SidePlayerTable from './SidePlayerTable';
import clamp from '../utils/clamp';

export default function Oponents({ socket, allPlayersInfo, allCharactersInfo, knownRoles, currentRoom, activateCharacter, selectCardTarget, selectPlayerTarget, username, currentPlayer, 
    characterUsable, confirmCardTarget, playersInRange, confirmPlayerTarget}) {
        
    const playerIndex = allPlayersInfo.findIndex(player => {
        // index of user player
        return (player.name === username);
    });
    
    // remove user player from players info array
    const oponentsInfo = allPlayersInfo.filter(player => {
        return (player.name !== username);
    });
    // remove user player from characters info array
    const charactersInfo = allCharactersInfo.filter(player => {
        return (player.name !== username);
    });

    if (oponentsInfo.length === 1) {
        return (
          <div className='w-[490px] xs:w-[560px] z-50 fixed left-[50%] translate-x-[-50%]'>
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
                character={charactersInfo[0].character}
                characterUsable={characterUsable}
                health={oponentsInfo[0].health}
                playersInRange={playersInRange}
                confirmPlayerTarget={confirmPlayerTarget}
                largeMagicConstant={352}
                smallMagicConstant={222}
                cardClampLimit={4}
              />
          </div>
        )
    }

    if (oponentsInfo.length === 3) {
        return (
            <div>
                <div className='fixed z-10 flex items-end justify-start w-[490px] left-[-172px] xs:left-[-158px] top-[248px] xs:top-[320px] rotate-90'>
                    <SidePlayerTable
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
                        character={charactersInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].character}
                        role={knownRoles[oponentsInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].name]}
                        characterUsable={characterUsable}
                        health={oponentsInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].health}
                        playersInRange={playersInRange}
                        confirmPlayerTarget={confirmPlayerTarget}
                        rotateDescription={-90}
                    />
                </div>
                <div className='fixed top-0 left-[50%] translate-x-[-50%] z-5'>
                    <div className='w-[420px] xs:w-[620px]'>                        
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
                            character={charactersInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].character}
                            role={knownRoles[oponentsInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].name]}
                            characterUsable={characterUsable}
                            health={oponentsInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].health}
                            playersInRange={playersInRange}
                            confirmPlayerTarget={confirmPlayerTarget}
                            largeMagicConstant={352}
                            smallMagicConstant={222}
                            cardClampLimit={4}
                        />
                    </div>
                </div>
                <div className='fixed z-10 flex items-end justify-end w-[490px] right-[-172px] xs:right-[-158px] top-[248px] xs:top-[320px] rotate-[270deg]'>
                    <SidePlayerTable
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
                        character={charactersInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].character}
                        role={knownRoles[oponentsInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].name]}
                        characterUsable={characterUsable}
                        health={oponentsInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].health}
                        playersInRange={playersInRange}
                        confirmPlayerTarget={confirmPlayerTarget}
                        rotateDescription={90}
                     />
                </div>
            </div>
        )
    }

    if (oponentsInfo.length === 4) {
        return (
            <div className=''>
                <div className='fixed z-10 flex items-end justify-start w-[490px] left-[-172px] xs:left-[-158px] top-[288px] xs:top-[348px] rotate-90 '>
                    <SidePlayerTable
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
                        character={charactersInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].character}
                        role={knownRoles[oponentsInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].name]}
                        characterUsable={characterUsable}
                        health={oponentsInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].health}
                        playersInRange={playersInRange}
                        confirmPlayerTarget={confirmPlayerTarget}
                        rotateDescription={-90}
                    />
                </div>
                <div className='fixed top-0 left-0 right-0 flex justify-center space-x-4 z-5'>
                    <div className='w-[420px] xs:w-[620px]'>                        
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
                            character={charactersInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].character}
                            role={knownRoles[oponentsInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].name]}
                            characterUsable={characterUsable}
                            health={oponentsInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].health}
                            playersInRange={playersInRange}
                            confirmPlayerTarget={confirmPlayerTarget}
                            largeMagicConstant={402}
                            smallMagicConstant={238}
                            cardClampLimit={5}
                        />
                    </div>
                    <div className='w-[420px] xs:w-[620px]'>                        
                     <TopPlayerTable
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
                            character={charactersInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].character}
                            role={knownRoles[oponentsInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].name]}
                            characterUsable={characterUsable}
                            health={oponentsInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].health}
                            playersInRange={playersInRange}
                            confirmPlayerTarget={confirmPlayerTarget}
                            largeMagicConstant={402}
                            smallMagicConstant={232}
                            cardClampLimit={5}
                        />
                    </div>
                </div>
                <div className='fixed flex items-end justify-end w-[490px] right-[-182px] xs:right-[-158px] top-[288px] xs:top-[348px] rotate-[270deg]'>
                    <SidePlayerTable
                        socket={socket}
                        cardsInHand={new Array(oponentsInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].numberOfCards).fill(0)}
                        table={oponentsInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].table}
                        oponentName={oponentsInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].name}
                        currentRoom={currentRoom}
                        activateCharacter={activateCharacter}
                        selectCardTarget={selectCardTarget}
                        selectPlayerTarget={selectPlayerTarget}
                        confirmCardTarget={confirmCardTarget}
                        currentPlayer={currentPlayer}
                        username={username}
                        character={charactersInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].character}
                        role={knownRoles[oponentsInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].name]}
                        characterUsable={characterUsable}
                        health={oponentsInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].health}
                        playersInRange={playersInRange}
                        confirmPlayerTarget={confirmPlayerTarget}
                        rotateDescription={90}
                    />
                </div>
            </div>
        )
    }

    if (oponentsInfo.length === 5) {
        return (
            <div className=''>
                <div className='fixed flex items-end justify-start w-[490px] left-[-172px] xs:left-[-158px] top-[294px] xs:top-[360px] rotate-90 '>
                    <SidePlayerTable
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
                        character={charactersInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].character}
                        role={knownRoles[oponentsInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].name]}
                        characterUsable={characterUsable}
                        health={oponentsInfo[clamp(playerIndex + 0, allPlayersInfo.length - 1)].health}
                        playersInRange={playersInRange}
                        confirmPlayerTarget={confirmPlayerTarget}
                        rotateDescription={-90}
                    />
                </div>
                <div className='fixed top-0 left-0 right-0 flex justify-center space-x-2 z-5'>
                    <div className='w-[350px] xs:w-[620px] z-1'>                        
                    <TopLeftPlayerTable
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
                            character={charactersInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].character}
                            role={knownRoles[oponentsInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].name]}
                            characterUsable={characterUsable}
                            health={oponentsInfo[clamp(playerIndex + 1, allPlayersInfo.length - 1)].health}
                            playersInRange={playersInRange}
                            confirmPlayerTarget={confirmPlayerTarget}
                            largeMagicConstant={362}
                            smallMagicConstant={152}
                            cardClampLimit={4}
                        />
                    </div>
                    <div className='w-[350px] xs:w-[620px] z-[10]'>                        
                     <TopPlayerTable
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
                            character={charactersInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].character}
                            role={knownRoles[oponentsInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].name]}
                            characterUsable={characterUsable}
                            health={oponentsInfo[clamp(playerIndex + 2, allPlayersInfo.length - 1)].health}
                            playersInRange={playersInRange}
                            confirmPlayerTarget={confirmPlayerTarget}
                            largeMagicConstant={362}
                            smallMagicConstant={152}
                            cardClampLimit={4}
                        />
                    </div>
                    <div className='w-[350px] xs:w-[620px] z-[11]'>                        
                     <TopRightPlayerTable
                            socket={socket}
                            cardsInHand={new Array(oponentsInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].numberOfCards).fill(0)}
                            table={oponentsInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].table}
                            oponentName={oponentsInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].name}
                            currentRoom={currentRoom}
                            activateCharacter={activateCharacter}
                            selectCardTarget={selectCardTarget}
                            selectPlayerTarget={selectPlayerTarget}
                            confirmCardTarget={confirmCardTarget}
                            currentPlayer={currentPlayer}
                            username={username}
                            character={charactersInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].character}
                            role={knownRoles[oponentsInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].name]}
                            characterUsable={characterUsable}
                            health={oponentsInfo[clamp(playerIndex + 3, allPlayersInfo.length - 1)].health}
                            playersInRange={playersInRange}
                            confirmPlayerTarget={confirmPlayerTarget}
                            largeMagicConstant={362}
                            smallMagicConstant={152}
                            cardClampLimit={4}
                        />
                    </div>
                </div>
                <div className='fixed flex items-end justify-end w-[490px] right-[-172px] xs:right-[-158px] top-[294px] xs:top-[360px] rotate-[270deg]'>
                    <SidePlayerTable
                        socket={socket}
                        cardsInHand={new Array(oponentsInfo[clamp(playerIndex + 4, allPlayersInfo.length - 1)].numberOfCards).fill(0)}
                        table={oponentsInfo[clamp(playerIndex + 4, allPlayersInfo.length - 1)].table}
                        oponentName={oponentsInfo[clamp(playerIndex + 4, allPlayersInfo.length - 1)].name}
                        currentRoom={currentRoom}
                        activateCharacter={activateCharacter}
                        selectCardTarget={selectCardTarget}
                        selectPlayerTarget={selectPlayerTarget}
                        confirmCardTarget={confirmCardTarget}
                        currentPlayer={currentPlayer}
                        username={username}
                        character={charactersInfo[clamp(playerIndex + 4, allPlayersInfo.length - 1)].character}
                        role={knownRoles[oponentsInfo[clamp(playerIndex + 4, allPlayersInfo.length - 1)].name]}
                        characterUsable={characterUsable}
                        health={oponentsInfo[clamp(playerIndex + 4, allPlayersInfo.length - 1)].health}
                        playersInRange={playersInRange}
                        confirmPlayerTarget={confirmPlayerTarget}
                        rotateDescription={90}
                    />
                </div>
            </div>
        )
    }

}
