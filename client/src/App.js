import "./App.css";
import io from "socket.io-client";
import { useState, useRef } from "react";
import RoomInput from "./components/RoomInput";
import Users from "./components/Users";

const socket = io.connect("http://localhost:3001");

// SRC: https://github.com/machadop1407/socket-io-react-example

function App() {
  //Room State
  const [roomInput, setRoomInput] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [username, setUsername] = useState("");
  const usernameRef = useRef();

  socket.on("rooms", (rooms) => {
    setRooms(rooms);
  })

  const joinRoom = (e) => {
    const room = e.target.id;
    console.log("joining: ", room);
    socket.emit("join_room", {room, username});
    setCurrentRoom(room);
  };

  const disconnect = () => {
    
  }

  socket.on("show_users", (data) => {
    setUsers(data.users);
    console.log(data.users);
  })

  return (
    <div className="App">
      {!currentRoom ? 
        <RoomInput usernameRef={usernameRef} setUsername={setUsername} username={username} rooms={rooms} joinRoom={joinRoom} />
      :
        <Users users={users} disconnect={disconnect} />
      }
    </div>
  );
}

export default App;
