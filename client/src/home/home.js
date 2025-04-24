import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom"; // For navigation
function Home() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup"); // Navigate to Sign Up page
  };

  const handleLogin = () => {
    navigate("/login"); // Navigate to Login page
  };
  return (
    <div>
      <div className="button-container flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
        <div className="text-center space-y-6">
          <h1 className="text-3xl text-white font-bold">
            Welcome to Client Feedback Portal{" "}
          </h1>
          <div className="space-x-4">
            <button
              onClick={handleSignup}
              className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-yellow-500 transition duration-300"
            >
              Sign Up
            </button>
            <button
              onClick={handleLogin}
              className="bg-green-400 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-green-500 transition duration-300"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      );
    </div>
  );
}

export default Home;
