import "./App.css";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import RoomInput from "./components/RoomInput";
import Room from "./components/Room";
import Game from "./components/Game";

const socket = io.connect("http://localhost:3001");

// SRC: https://github.com/machadop1407/socket-io-react-example

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [username, setUsername] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const [myHand, setMyHand] = useState([]);
  const [allHands, setAllHands] = useState([]);

  const usernameRef = useRef();
  const newRoomRef = useRef();

  useEffect(() => {
    socket.on("rooms", (rooms) => {
      setRooms(rooms);
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
      setAllHands(data);
    })

    socket.on("my_hand", hand => {
      console.log("my hand: ", hand); // TODO: this runs multiple times??? 
      setMyHand(hand);
    })
  }, [username, currentRoom])

  const joinRoom = (e) => {
    const room = e.target.id;
    socket.emit("join_room", {currentRoom: room, username});
    setCurrentRoom(room);
  };

  const createRoom = (roomName) => {
    socket.emit("create_room", roomName);
  }

  const leaveRoom = () => {
    socket.emit("leave_room", {username, currentRoom});
    setGameStarted(false);
    setCurrentRoom(null);
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
    <div className="App">
      {!currentRoom ? 
        <RoomInput 
          usernameRef={usernameRef} 
          newRoomRef={newRoomRef} 
          setUsername={setUsername} 
          createRoom={createRoom} 
          username={username} 
          rooms={rooms} 
          joinRoom={joinRoom} />
      :
        <Room 
          users={users} 
          messages={messages} 
          roomName={currentRoom} 
          leaveRoom={leaveRoom} 
          sendMessage={sendMessage}
          startGame={startGame}
          gameStarted={gameStarted}
          />
      }
      {gameStarted ? 
        <Game 
          socket={socket} 
          username={username} 
          roomName={currentRoom}
          myHand={myHand}
          allHands={allHands}  />
      :
       null
      }
    </div>
  );
}

export default App;
