import "./App.css";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import RoomSelect from "./components/RoomSelect";
import Room from "./components/Room";
import Game from "./components/Game";
import Chat from "./components/Chat";


// SRC: https://github.com/machadop1407/socket-io-react-example
const socket = io.connect("http://localhost:3001");

function App() {

  const [currentRoom, setCurrentRoom] = useState(JSON.parse(localStorage.getItem('current-room')));
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [username, setUsername] = useState("");
  const [admin, setAdmin] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [character, setCharacter] = useState("");

  const [myHand, setMyHand] = useState([]);
  const [myDrawChoice, setMyDrawChoice] = useState([]);
  const [allPlayersInfo, setAllPlayersInfo] = useState([]);
  const [playersLosingHealth, setPlayersLosingHealth] = useState([]);
  const [playersActionRequiredOnStart, setPlayersActionRequiredOnStart] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [topStackCard, setTopStackCard] = useState({});
  const [duelActive, setDuelActive] = useState(false);
  const [indianiActive, setIndianiActive] = useState(false);
  const [emporioState, setEmporioState] = useState([]);
  const [nextEmporioTurn, setNextEmporioTurn] = useState("");
  const [characterUsable, setCharacterUsable] = useState(false);

  const newRoomRef = useRef();

  useEffect(() => {

    socket.on("rooms", (rooms) => {
      setRooms(rooms);
    })

    socket.on("room_left", () => {
    localStorage.setItem('room-name', JSON.stringify(null));
    })

    socket.on("get_players", (users) => {
      setUsers(users);
    })

    socket.on("get_messages", (messages) => {
      setMessages(messages);
    })

    // GAME LOGIC
    socket.on("game_started", data => {
      setGameStarted(true);
      if (currentRoom !== null) {
        console.log("emit game start");
        socket.emit("get_my_hand", {username, currentRoom});
      }
      console.log("all hands: ", data);
      setAllPlayersInfo(data);
    })

    socket.on("characters", characters => {
      for (let character of characters) {
        if (character.playerName === username) {
          setCharacter(character.character);
          break;
        }
      }
    })

    socket.on("current_player", playerName => {
      console.log("Get my hand...");
      if (username === "") return;
      if (currentRoom === null) return;
      setCurrentPlayer(playerName);
      socket.emit("get_my_hand", {username, currentRoom});
    })

    socket.on("my_hand", hand => {
      console.log("my hand: ", hand); // TODO: this runs multiple times??? 
      setMyHand(hand);
    })

    socket.on("my_draw_choice", hand => {
      setMyDrawChoice(hand);
    })

    socket.on("update_hands", () => {
      if (username === "") return;
      if (currentRoom === null) return;
      socket.emit("get_my_hand", {username, currentRoom});
    })

    socket.on("update_draw_choices", (characterName) => {
      if (username === "") return;
      if (currentRoom === null) return;
      console.log("character: ", character);
      console.log("characterName: ", characterName);
      if (characterName === character) {

        if (characterName === "Jesse Jones") {
          setCharacterUsable(true);

        } else if (characterName === "Pedro Ramirez") {
          setCharacterUsable(true);

        } else {
          socket.emit("get_my_draw_choice", {username, currentRoom, character});
        }
      }
    })

    socket.on("update_players_losing_health", (players) => {
      setPlayersLosingHealth(players);
    })

    socket.on("update_players_with_action_required", (players) => {
      setPlayersActionRequiredOnStart(players);
    })

    socket.on("update_all_players_info", (players) => {
      // returns array [{name, numberOfCards, health}]
      setAllPlayersInfo(players);
    })

    socket.on("update_top_stack_card", (card) => {
      setTopStackCard(card);
    })

    socket.on("duel_active", (state) => {
      setDuelActive(state);
    })

    socket.on("indiani_active", (state) => {
      setIndianiActive(state);
    })

    socket.on("emporio_state", (state) => {
      setEmporioState(state.cards);
      setNextEmporioTurn(state.nextEmporioTurn);
    })

  }, [username, currentRoom, character])
  
  const leaveRoom = () => {
    socket.emit("leave_room", {username, currentRoom});
    setAdmin(false);
    setGameStarted(false);
    setCurrentRoom(null);
    localStorage.setItem('room-name', JSON.stringify(null));
  }

  const sendMessage = (message) => {
    socket.emit("send_message", {currentRoom, username, message})
  }

  function startGame() {
    // TODO: check if players >= 4
    const players = users.map((user) => {
      return user.username
    })
    socket.emit("start_game", {players, currentRoom})
  }

  return (
    <div className="App flex flex-col justify-start items-center h-screen">
      {currentRoom === null ? 
        <>
          <img className="w-max mt-12" src={require('./img/bang-logo.png')} alt="Bang! logo" />
          <RoomSelect 
            newRoomRef={newRoomRef} 
            setUsername={setUsername} 
            socket={socket} 
            setCurrentRoom={setCurrentRoom} 
            username={username} 
            rooms={rooms} 
            setAdmin={setAdmin}
          />
        </>
      :
      !gameStarted &&
        <Room 
          users={users} 
          messages={messages} 
          roomName={currentRoom} 
          leaveRoom={leaveRoom} 
          sendMessage={sendMessage}
          startGame={startGame}
          gameStarted={gameStarted}
          admin={admin}
          />
      }
      {gameStarted ? 
      <>
        <Game 
          myHand={myHand}
          allPlayersInfo={allPlayersInfo}
          setAllPlayersInfo={setAllPlayersInfo}
          username={username}
          character={character}
          socket={socket}
          currentRoom={currentRoom}
          currentPlayer={currentPlayer}
          playersLosingHealth={playersLosingHealth}
          playersActionRequiredOnStart={playersActionRequiredOnStart}
          topStackCard={topStackCard}
          duelActive={duelActive}
          indianiActive={indianiActive}
          emporioState={emporioState}
          myDrawChoice={myDrawChoice}
          nextEmporioTurn={nextEmporioTurn}
          characterUsable={characterUsable}
          setCharacterUsable={setCharacterUsable}
          sendMessage={sendMessage}
        />
        <div className='fixed left-1 bottom-1'>
          <Chat sendMessage={sendMessage} messages={messages} width={260} />
        </div>
      </>
      :
       null
      }
    </div>
  );
}

export default App;
