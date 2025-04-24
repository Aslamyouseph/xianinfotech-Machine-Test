import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Import icons
import "./NavBar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/user/logout", {
        method: "POST", // Use GET method since that's what the backend expects
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("Response status:", res.status);
      if (res.ok) {
        localStorage.removeItem("user"); // Remove user from localStorage
        setIsLoggedIn(false); // Update state
        navigate("/"); // Redirect to login/home
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      // console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Name */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          Client <span className="text-yellow-400">Feedback Portal</span>
        </Link>
        {/* TODO:Desktop Navigation  setup */}
        <ul className="hidden md:flex space-x-6 text-lg">
          <li>
            <Link
              to="/profile"
              className="hover:text-yellow-300 transition duration-300"
            >
              Account
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="hover:text-yellow-300 transition duration-300"
            >
              Login
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
        {/* TODO:Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation setup*/}
      {isMenuOpen && (
        <ul className="md:hidden bg-blue-700 text-white space-y-4 text-center py-4">
          <li>
            <Link
              to="/profile"
              className="block py-2 hover:text-yellow-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Account
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="hover:text-yellow-300 transition duration-300"
            >
              Login
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
  );
};

export default Navbar;
