import "../App.css"
import io from "socket.io-client";
import { useState } from "react";
import {Link} from "react-router-dom"
// const socket= io.connect("http://localhost:3001");
const socket= io("http://localhost:3001",{transports:["websocket"]})
let user:string = ""
let rooms:string = "";
const Homepage = () => {
    const [username, setUsername] = useState<string>("");
    const [room, setRoom] = useState<string>("");
    const [showChat, setShowChat] = useState<boolean>(false);

    const joinRoom = () => {
        if (username !== "" && room !== "") {
            user=username;
            rooms=room
          socket.emit("join_room", room);
          setShowChat(true);
        }
      };
    

  return (
    <div className="App">
    <div className="joinChatContainer">
         <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
        <Link to="/checkers"><button onClick={joinRoom}>Join A Room</button></Link>
        </div>
        </div>
  )
}

export default Homepage
export {rooms}
export {user}

console.log({rooms, user})
