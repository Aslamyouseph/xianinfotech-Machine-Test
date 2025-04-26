import React from "react";
import FeedBack from "../../UserCompounts/FeedBack/FeedBack";
import Navbar from "../../UserCompounts/NavBar/NavBar";
import SearchBar from "../../UserCompounts/SearchBar/SearchBar";

function ChatApp() {
  return (
    <div>
      {/*This is used to import the Navigation bar page*/}
      <Navbar />
      <SearchBar />
      <FeedBack />
    </div>
  );
}

export default ChatApp;
