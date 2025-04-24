import React, { useEffect, useState } from "react";
import "./FeedBack.css";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    message: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch session info
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
          // Update formData with session user
          setFormData((prev) => ({
            ...prev,
            name: data.user.name,
            email: data.user.email,
          }));
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkLoginStatus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.rating || !formData.message) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/Feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Your Feedback has been submitted successfully");
        setFormData({
          name: formData.name,
          email: formData.email,
          rating: "",
          message: "",
        });
        setError("");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit feedback. ");
    }
  };

  return (
    <div className="feedback-container">
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form className="feedback-form" onSubmit={handleSubmit}>
        <h1>Client Feedback Portal</h1>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          readOnly
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          readOnly
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
          required
        ></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
