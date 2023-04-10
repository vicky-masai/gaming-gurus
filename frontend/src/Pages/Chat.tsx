import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";
import {user} from "./Homepage"
import {rooms,socket} from "./Homepage"
import "../App.css"


interface Msg {room:string,author:string,message:string,time:string}

// const socket= io("http://localhost:3001",{transports:["websocket"]})
const Chat = () => {
  
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<Msg[]>([]);
  
  const sendMessage = async () => {
      if (currentMessage !== "") { 
        const messageData:Msg = {
          room: rooms,
          author: user,
          message: currentMessage,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        };
    console.log(messageList)
        await socket.emit("send_message", messageData);
		console.log("message sent", messageData)
        setMessageList((list:Msg[]) => [...list, messageData]);
        setCurrentMessage("");
      }
    };
  
    useEffect(() => {
      socket.on("receive_message", (data) => {
        setMessageList((list) => [...list, data]);
      });
      console.log("useeff")
    }, [socket]);
  

  return (
    <div className="chat-window">
    <div className="chat-header">
      <p>Live Chat</p>
    </div>
    <div className="chat-body">
      <ScrollToBottom className="message-container">
        {messageList.map((messageContent:Msg) => {
          return (
            <div
             
              className="message"
              id={user === messageContent.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </ScrollToBottom>
    </div>
    <div className="chat-footer">
      <input
        type="text"
        value={currentMessage}
        placeholder="Hey..."
        onChange={(event) => {
          setCurrentMessage(event.target.value);
        }}
        // onKeyPress={(event) => {
        //   event.key === "Enter" && sendMessage();
        // }}
      />
      <button onClick={sendMessage}>&#9658;</button>
    </div>
  </div>
  )
}

export default Chat