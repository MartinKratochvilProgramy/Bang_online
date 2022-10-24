import "./App.css";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import RoomInput from "./components/RoomInput";
import Room from "./components/Room";

const socket = io.connect("http://localhost:3001");

// SRC: https://github.com/machadop1407/socket-io-react-example

function App() {
  //Room State
  const [currentRoom, setCurrentRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [username, setUsername] = useState("");
  const usernameRef = useRef();
  const newRoomRef = useRef();

  useEffect(() => {
    socket.on("rooms", (rooms) => {
      setRooms(rooms);
    })

    socket.on("show_users", (data) => {
      setUsers(data);
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


  return (
    <div className="App">
      {!currentRoom ? 
        <RoomInput usernameRef={usernameRef} newRoomRef={newRoomRef} setUsername={setUsername} createRoom={createRoom} username={username} rooms={rooms} joinRoom={joinRoom} />
      :
        <Room users={users} roomName={currentRoom} leaveRoom={leaveRoom} />
      }
    </div>
  );
}

export default App;
