import React from "react";
import AdminViewRespond from ".././AdminViewFeedback/ViewFeedback";
import HomeDesign from "../../AdminCompounts/AdminHome/AdminHome";
import SearchBar from "../../UserCompounts/SearchBar/SearchBar";

function viewResponds() {
  return (
    <div>
      <HomeDesign />
      {/* <SearchBar /> */}
      <AdminViewRespond />
    </div>
  );
}

export default viewResponds;
