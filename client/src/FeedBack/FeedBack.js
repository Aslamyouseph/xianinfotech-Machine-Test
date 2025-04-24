import React, { useRef, useState, useEffect } from "react"; // Ensure React is imported
import { IoSend, IoChatbubblesSharp } from "react-icons/io5";
import socketIOClient from "socket.io-client";
import "./FeedBack.css";

function ChatApp() {
  return (
    <div className="chat-wrapper">
      <h1>This is the user feedback page</h1>
    </div>
  );
}

export default ChatApp;
