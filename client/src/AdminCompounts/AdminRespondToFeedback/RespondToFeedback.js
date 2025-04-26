import React, { useState } from "react";
import "./RespondToFeedback.css";
import { useNavigate, useParams } from "react-router-dom";

function RespondToFeedback() {
  const { id } = useParams();
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setResponse(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/FeedBackResponse/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ response }), // Send JSON body
        }
      );

      if (!res.ok) throw new Error("Failed to update Feedback Response.");
      setSuccessMessage("Feedback Response submitted successfully!");
      setTimeout(() => navigate("/AdminHome"), 2000);
    } catch (error) {
      console.error("Error updating Feedback Response:", error);
      setError("Failed to update Feedback Response. Please try again.");
    }
  };

  return (
    <div className="feedback-container">
      <h2 className="feedback-header">Respond to Feedback</h2>

      {successMessage && <p className="success-msg">{successMessage}</p>}
      {error && <p className="error-msg">{error}</p>}

      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="response" className="form-label">
            Response:
          </label>
          <textarea
            id="response"
            name="response"
            value={response}
            onChange={handleChange}
            placeholder="Write your response here..."
            className="form-textarea"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <button type="submit" className="submit-btn">
            Submit Response
          </button>
        </div>
      </form>
    </div>
  );
}

export default RespondToFeedback;
