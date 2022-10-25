import "./App.css";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import RoomInput from "./components/RoomInput";
import Room from "./components/Room";

const socket = io.connect("http://localhost:3001");

// SRC: https://github.com/machadop1407/socket-io-react-example

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [username, setUsername] = useState("");
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

    socket.on("get_deck", (deck) => {
      console.log(deck);
    })
  }, [])

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
    setCurrentRoom(null);
  }

  const sendMessage = (message) => {
    socket.emit("send_message", {currentRoom, username, message})
  }

  const getDeck = () => {
    socket.emit("get_deck", currentRoom);
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
          getDeck={getDeck} />
      }
    </div>
  );
}

export default App;
