import React from "react";
import FeedBack from "../../UserCompounts/FeedBack/FeedBack";
import Navbar from "../../UserCompounts/NavBar/NavBar";
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
