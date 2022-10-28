import React from 'react'

export default function Card({ socket, card, setActiveCard, setSelectPlayerTarget, currentRoom, username }) {

    // TODO: this is not necessary
    const isPlayable = card.isPlayable
    const cardName = card.name;
    const cardDigit = card.digit;
    const cardType = card.type;

    function handleClick() {
        if (!isPlayable) return;
        
        if (cardName === "Bang!") {
          setActiveCard({name: "Bang!", cardDigit, cardType});
          setSelectPlayerTarget(true);
          socket.emit("request_players_in_range", {range: 1, currentRoom, username});

        } else if (cardName === "Mancato!") {
          socket.emit("play_mancato", {username, currentRoom, cardDigit, cardType});

        } else if (cardName === "Beer") {
          socket.emit("play_beer", {username, currentRoom, cardDigit, cardType});

        } else if (cardName === "Diligenza") {
          socket.emit("play_diligenza", {username, currentRoom, cardDigit, cardType});

        } else if (cardName === "Wells Fargo") {
          socket.emit("play_wellsfargo", {username, currentRoom, cardDigit, cardType});


        } else if (cardName === "Duel") {
          setActiveCard({name: cardName, cardDigit, cardType});
          setSelectPlayerTarget(true);
          socket.emit("request_players_in_range", {range: "max", currentRoom, username});

        } else if (cardName === "Cat Ballou") {
          setActiveCard({name: cardName, cardDigit, cardType});
          setSelectPlayerTarget(true);
          socket.emit("request_players_in_range", {range: "max", currentRoom, username});

        } else if (cardName === "Panico") {
          setActiveCard({name: cardName, cardDigit, cardType});
          setSelectPlayerTarget(true);
          socket.emit("request_players_in_range", {range: 1, currentRoom, username});
        
        } else if (cardName === "Apaloosa" || cardName === "Mustang") {
          socket.emit("place_blue_card_on_table", {username, currentRoom, card});
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
