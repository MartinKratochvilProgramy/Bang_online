import React from 'react'

export default function Card({ socket, card, setActiveCard, setSelectPlayerTarget, setSelectCardTarget, currentRoom, username, duelActive, indianiActive }) {

    // TODO: this is not necessary
    const isPlayable = card.isPlayable
    const cardName = card.name;
    const cardDigit = card.digit;
    const cardType = card.type;

    function handleClick() {
        if (!isPlayable) return;
        
        if (cardName === "Bang!") {
          if (!duelActive && !indianiActive) {
            setActiveCard(card);
            setSelectPlayerTarget(true);
            socket.emit("request_players_in_range", {range: 1, currentRoom, username});

          } else if (indianiActive) {
            console.log("Bang on indiani");
            socket.emit("play_bang_on_indiani", {username, currentRoom, cardDigit, cardType});

          } else if (duelActive) {
            console.log("Bang in duel");
            socket.emit("play_bang_in_duel", {username, currentRoom, cardDigit, cardType});
          }

        } else if (cardName === "Mancato!") {
          socket.emit("play_mancato", {username, currentRoom, cardDigit, cardType});

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

        } else if (cardName === "Cat Ballou") {
          setActiveCard(card);
          setSelectPlayerTarget(true);
          setSelectCardTarget(true);
          socket.emit("request_players_in_range", {range: "max", currentRoom, username});
          
        } else if (cardName === "Panico") {
          setActiveCard(card);
          setSelectPlayerTarget(true);
          setSelectCardTarget(true);
          socket.emit("request_players_in_range", {range: 1, currentRoom, username});
        
        } else if (card.rimColor === "blue" && card.name !== "Prigione") {
          socket.emit("place_blue_card_on_table", {username, currentRoom, card});

        } else if (card.name === "Prigione") {
          setActiveCard(card);
          setSelectPlayerTarget(true);
          socket.emit("request_players_in_range", {range: "max_not_sheriffo", currentRoom, username});
        }
    }

    let styles;
    if (isPlayable) {
      styles = {color: "red"}
    } 

  return (
    <button onClick={handleClick} style={styles}>
        {cardName} <br /> {cardDigit} {cardType}
    </button>
  )
}
