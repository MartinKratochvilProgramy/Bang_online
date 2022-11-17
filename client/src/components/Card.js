import React from 'react'

export default function Card({ socket, card, setActiveCard, setSelectPlayerTarget, setSelectCardTarget, currentRoom, username, currentPlayer, duelActive, indianiActive, discarding, character, onClick }) {

    const isPlayable = card.isPlayable
    const cardName = card.name;
    const cardDigit = card.digit;
    const cardType = card.type;

    function handleClick() {

      if (onClick !== undefined) {
        onClick();
        return;
      }
      
      if (discarding) {
        socket.emit("discard", {username, currentRoom, card});
        return;
      }

      if (!isPlayable) return;

      setSelectPlayerTarget(false);
      setSelectCardTarget(false);
        
      if (cardName === "Bang!") {
        if (username !== currentPlayer && !indianiActive && !duelActive && character === "Calamity Janet") {
          socket.emit("play_bang_as_CJ", {username, currentRoom, cardDigit, cardType});

        } else if (!duelActive && !indianiActive) {
          setActiveCard(card);
          setSelectPlayerTarget(true);
          socket.emit("request_players_in_range", {range: 1, currentRoom, username});

        } else if (indianiActive) {
          socket.emit("play_bang_on_indiani", {username, currentRoom, cardDigit, cardType});

        } else if (duelActive) {
          socket.emit("play_bang_in_duel", {username, currentRoom, cardDigit, cardType});
        }

      } else if (cardName === "Mancato!") {
        if (username === currentPlayer && !duelActive && character === "Calamity Janet") {
          setActiveCard(card);
          setSelectPlayerTarget(true);
          socket.emit("request_players_in_range", {range: 1, currentRoom, username});
        } else if (duelActive && character === "Calamity Janet"){
          socket.emit("play_mancato_in_duel", {username, currentRoom, cardDigit, cardType});
        } else if (indianiActive && character === "Calamity Janet"){
          socket.emit("play_mancato_on_indiani", {username, currentRoom, cardDigit, cardType});
        } else {
          socket.emit("play_mancato", {username, currentRoom, cardDigit, cardType});
        }

      } else if (cardName === "Beer") {
        socket.emit("play_beer", {username, currentRoom, cardDigit, cardType});

      } else if (cardName === "Saloon") {
        socket.emit("play_saloon", {username, currentRoom, cardDigit, cardType});

      } else if (cardName === "Emporio") {
        socket.emit("play_emporio", {username, currentRoom, cardDigit, cardType});

      } else if (cardName === "Diligenza") {
        socket.emit("play_diligenza", {username, currentRoom, cardDigit, cardType});

      } else if (cardName === "Wells Fargo") {
        socket.emit("play_wellsfargo", {username, currentRoom, cardDigit, cardType});

      } else if (cardName === "Gatling") {
        socket.emit("play_gatling", {username, currentRoom, cardDigit, cardType});

      } else if (cardName === "Indiani") {
        socket.emit("play_indiani", {username, currentRoom, cardDigit, cardType});

      } else if (cardName === "Duel") {
        setActiveCard(card);
        setSelectPlayerTarget(true);
        socket.emit("request_players_in_range", {range: "max", currentRoom, username});

      } else if (cardName === "Cat Balou") {
        setActiveCard(card);
        setSelectPlayerTarget(true);
        setSelectCardTarget(true);
        socket.emit("request_players_in_range", {range: "max", currentRoom, username});
        
      } else if (cardName === "Panico") {
        setActiveCard(card);
        setSelectPlayerTarget(true);
        setSelectCardTarget(true);
        socket.emit("request_players_in_range", {range: "one_not_gun", currentRoom, username});
      
      } else if (card.rimColor === "blue" && cardName !== "Prigione") {
        socket.emit("place_blue_card_on_table", {username, currentRoom, card});

      } else if (cardName === "Prigione") {
        setActiveCard(card);
        setSelectPlayerTarget(true);
        socket.emit("request_players_in_range", {range: "max_not_sheriff", currentRoom, username});
      }
    }

    let styles = {cursor: "auto"};
    if (isPlayable) {
      styles = {color: "red", border: "solid 2px red", cursor: "pointer"}
    } 
    if (discarding) {
      styles = {color: "red", border: "solid 2px red", cursor: "pointer"}
    } 

    const cardSource = require("../img/gfx/cards/" + cardName.replace(/!/, '').replace(/\s/, '').replace(/\./g, '')+ ".png");

  return (
    <button 
      onClick={handleClick} 
      style={styles} 
      className='w-[60px] xs:w-[80px] rounded-md group flex flex-row justify-center'>
      <img src={cardSource} alt="" />
      <div className='hidden p-1 z-40 font-rye absolute group-hover:flex group-hover:flex-col group-hover:justify-center translate-y-[-60px] bg-transparentBlack text-white'>
        <div className='text-xl'>
          {cardName}
        </div>
        <div className='text-xs'>
          {cardDigit} {cardType}
        </div>
      </div>
    </button>
  )
}
