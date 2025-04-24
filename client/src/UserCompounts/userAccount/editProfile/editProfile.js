import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./editProfile.css";

function EditProfile() {
  const [user, setUser] = useState(null); // State to store user details
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const navigate = useNavigate(); // Get the navigate function

  // Fetch login user details to pre-fill the form
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          credentials: "include", // Ensures that the session is used for authentication
        });

        const data = await res.json();
        if (data.success) {
          setUser(data.user); // Store the user data
          setFormData({
            name: data.user.name,
            email: data.user.email,
          }); // Pre-fill the form fields with the fetched data
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

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update form data on input change
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/editprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id: user._id }), // Pass user ID here
        credentials: "include", // Include session in the request
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Account details updated successfully!");
        setError("");
        setTimeout(() => {
          navigate("/FeedBack"); // After updating, navigate to the chat app
        }, 1000);
      } else {
        setError(data.message || "Edit failed. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Edit Account
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}

        {user ? (
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <input
                type="hidden"
                id="id"
                name="id"
                value={user._id} // Pass the user ID in the hidden field
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <p>Session expired. Please re-login again.</p>
        )}
      </div>
    </div>
  );
}

export default EditProfile;
