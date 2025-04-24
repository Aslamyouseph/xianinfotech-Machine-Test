import React from "react";
import FeedBack from "../FeedBack/FeedBack";
import Navbar from "../NavBar/NavBar";
function ChatApp() {
  return (
    <div>
      {/*This is used to import the Navigation bar page*/}
      <Navbar />
      <FeedBack />
    </div>
  );
}

export default ChatApp;
