import "./App.css";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import RoomSelect from "./components/RoomSelect";
import Room from "./components/Room";
import Game from "./components/Game";


// SRC: https://github.com/machadop1407/socket-io-react-example
const socket = io.connect("http://localhost:3001");

function App() {

  const [myCharacterChoice, setMyCharacterChoice] = useState([]);
  const [characterChoiceInProgress, setCharacterChoiceInProgress] = useState(true);
  const [currentRoom, setCurrentRoom] = useState(null); // TODO: JSON.parse(localStorage.getItem('room-name'))
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [username, setUsername] = useState(JSON.parse(sessionStorage.getItem('username')) || "");
  const [admin, setAdmin] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [role, setRole] = useState("");
  const [knownRoles, setKnownRoles] = useState({});
  const [character, setCharacter] = useState("");

  const [myHand, setMyHand] = useState([]);
  const [myDrawChoice, setMyDrawChoice] = useState([]);
  const [allPlayersInfo, setAllPlayersInfo] = useState([]);
  const [playersLosingHealth, setPlayersLosingHealth] = useState([]);
  const [playersActionRequiredOnStart, setPlayersActionRequiredOnStart] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [topStackCard, setTopStackCard] = useState(null);
  const [duelActive, setDuelActive] = useState(false);
  const [indianiActive, setIndianiActive] = useState(false);
  const [emporioState, setEmporioState] = useState([]);
  const [nextEmporioTurn, setNextEmporioTurn] = useState("");

  const newRoomRef = useRef();

  useEffect(() => {
    socket.on("username_changed", (username) => {
      setUsername(username);
    })

    socket.on("get_character_choices", (characters) => {
      // receive two chars to pick from
      setGameStarted(true);
      setMyCharacterChoice(characters[username]);
    })

    socket.on("rooms", (rooms) => {
      setRooms(rooms);
    })

    socket.on("get_players", (users) => {
      setUsers(users);
    })

    socket.on("get_messages", (messages) => {
      setMessages(messages);
    })

    socket.on("console", consoleMessage => {
      setConsoleOutput([...consoleOutput, ...consoleMessage])
    })

    // GAME LOGIC
    socket.on("game_started", data => {
      setCharacterChoiceInProgress(false);
      setGameStarted(true);
      if (currentRoom !== null) {
        socket.emit("get_my_role", {username, currentRoom});
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

    socket.on("my_role", role => {
      console.log("my role: ", role); // TODO: this runs multiple times??? 
      setRole(role);
    })

    socket.on("known_roles", roles => {
      console.log("known roles: ", roles); // TODO: this runs multiple times??? 
      setKnownRoles(roles);
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

  }, [username, currentRoom, character, consoleOutput])
  
  const leaveRoom = () => {
    socket.emit("leave_room", {username, currentRoom});
    setAdmin(false);
    setGameStarted(false);
    setCurrentRoom(null);
  }

  const sendMessage = (message) => {
    socket.emit("send_message", {currentRoom, username, message})
  }

  function startGame() {
    const players = users.map((user) => {
      return user.username
    })
    socket.emit("start_game", {players, currentRoom})
  }


  return (
    <div className="App flex flex-col justify-start items-center h-screen">
      {currentRoom === null ? 
        <>
          <img className="w-[300px] xs:w-max mt-2 xs:mt-12" src={require('./img/bang-logo.png')} alt="Bang! logo" />
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
      <Game 
        myCharacterChoice={myCharacterChoice}
        characterChoiceInProgress={characterChoiceInProgress}
        setCharacter={setCharacter}
        myHand={myHand}
        allPlayersInfo={allPlayersInfo}
        setAllPlayersInfo={setAllPlayersInfo}
        username={username}
        character={character}
        role={role}
        knownRoles={knownRoles}
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
        sendMessage={sendMessage}
        messages={messages}
        consoleOutput={consoleOutput}
      />
      :
       null
      }
    </div>
  );
}

export default App;
