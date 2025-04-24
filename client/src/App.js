import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios"; //This us used to connect the frontend to the backend
import { Routes, Route, Link, useNavigate } from "react-router-dom"; // This is used to enable routing.
import Home from "./userPage/home";
import Login from "./userPage/login";
import Signup from "./userPage/signup";
import Profile from "./userPage/profile";
import EditProfile from "./userPage/editProfile";
import ChatApp from "./userPage/chatApp";
function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from Node.js server
    axios
      .get("http://localhost:5000")
      .then((response) => {
        setData(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <Routes>
        {/*creating a route for home page*/}
        <Route path="/" element={<Home />} />
        {/*creating a route for edit profile */}
        <Route path="/editProfile" element={<EditProfile />} />
        {/*creating a route login */}
        <Route path="/login" element={<Login />} />{" "}
        {/*creating a route profile*/}
        <Route path="/profile" element={<Profile />} />{" "}
        {/*creating a route signup*/}
        <Route path="/signup" element={<Signup />} />{" "}
        {/*creating a route chatApp page*/}
        <Route path="/chatApp" element={<ChatApp />} />{" "}
      </Routes>
    </div>
  );
}

export default App;
