import React, { useRef, useState, useEffect } from "react"; // Ensure React is imported
import "./FeedBack.css";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    message: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [sessionEmail, setSessionEmail] = useState("");
  // Check login status
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/checksection", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          setSessionName(data.user.name);
          setSessionEmail(data.user.email);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkLoginStatus();
  }, []);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", formData);
    alert("Thank you for your feedback!");
    setFormData({
      name: "",
      email: "",
      rating: "",
      message: "",
    });
  };

  return (
    <div className="feedback-container">
      <form className="feedback-form" onSubmit={handleSubmit}>
        <h1> Client Feedback Portal</h1>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={sessionName}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={sessionEmail}
          onChange={handleChange}
          required
        />

        <label>Rating:</label>
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value="">Choose...</option>
          <option value="5">🌟🌟🌟🌟🌟 - Excellent</option>
          <option value="4">🌟🌟🌟🌟 - Good</option>
          <option value="3">🌟🌟🌟 - Average</option>
          <option value="2">🌟🌟 - Poor</option>
          <option value="1">🌟 - Very Poor</option>
        </select>

        <label>Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          required
        ></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
