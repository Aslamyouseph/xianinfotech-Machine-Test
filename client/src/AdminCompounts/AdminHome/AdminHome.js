import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./AdminHome.css";

function HomeDesign() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Add your logout logic here (e.g., clearing cookies/session)
    navigate("/login");
  };

  return (
    <div>
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold tracking-wide">
            Client Feedback Portal -{" "}
            <span className="text-yellow-400">Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6 text-lg">
            <li>
              <Link
                to="/Respond"
                className="hover:text-yellow-300 transition duration-300"
              >
                View Feedback
              </Link>
            </li>
            <li>
              <Link
                to="/RespondToFeedback"
                className="hover:text-yellow-300 transition duration-300"
              >
                Respond to Feedback
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-yellow-500 transition duration-300"
              >
                Logout
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <ul className="md:hidden bg-blue-700 text-white space-y-4 text-center py-4">
            <li>
              <Link
                to="/Respond"
                className="block py-2 hover:text-yellow-300"
                onClick={() => setIsMenuOpen(false)}
              >
                View Feedback
              </Link>
            </li>
            <li>
              <Link
                to="/RespondToFeedback"
                className="block py-2 hover:text-yellow-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Respond to Feedback
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-yellow-400 text-blue-900 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </nav>
    </div>
  );
}

export default HomeDesign;
