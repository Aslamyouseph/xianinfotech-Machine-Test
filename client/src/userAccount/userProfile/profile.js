import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null); // State to store user details
  const [error, setError] = useState(null); // State to store error messages
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          method: "get",
          credentials: "include",
        });

        const data = await res.json();
        console.log("Fetched Data:", data);
        if (data.success) {
          setUser(data.user);
        } else {
          setError("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Something went wrong. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Session expired. Please re-login again.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r">
      <div className="max-w-lg w-full p-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            User Profile
          </h1>
          <p className="text-lg text-gray-500">
            View and update your details below
          </p>
        </div>
        {error && <p className="text-red-500">{error}</p>} {/* Error message */}
        <div className="space-y-6">
          {/* Username */}
          <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 shadow-md hover:bg-gray-100 transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800">Username</h2>
            <p className="text-gray-600">{user.name}</p>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 shadow-md hover:bg-gray-100 transition duration-300">
            <h2 className="text-xl font-semibold text-gray-800">Email</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="mt-8">
          <button
            onClick={() => navigate("/editProfile")}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-800 transition duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
