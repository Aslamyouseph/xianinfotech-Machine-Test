import React, { useEffect, useState, useContext } from "react";
import "./FeedBack.css";
import { SearchContext } from "../../SearchContext";

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    message: "",
  });
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { search } = useContext(SearchContext);

  // Check login status and set user details
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
          setFormData((prev) => ({
            ...prev,
            name: data.user.name,
            email: data.user.email,
          }));
        }
      } catch (error) {
        console.error("Login check error:", error);
      }
    };
    checkLoginStatus();
  }, []);

  // Fetch all feedbacks
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/getFeedBack", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setFeedbackList(data.Feedback || []);
      } catch (err) {
        console.error("Error fetching feedback:", err);
      }
    };
    fetchFeedback();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { rating, message } = formData;

    if (!rating || !message || ![1, 2, 3, 4, 5].includes(Number(rating))) {
      setFormError("Please select a valid rating and enter your message.");
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
        setSuccessMessage("Feedback submitted successfully.");
        setFormError("");
        setFormData((prev) => ({ ...prev, rating: "", message: "" }));
        setFeedbackList((prev) => [data.feedback, ...prev]);
      } else {
        setFormError(data.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setFormError("Something went wrong. Please try again.");
    }
  };

  // Auto-clear success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="feedback-wrapper">
      {/* Feedback Form */}
      <div className="feedback-form-section">
        <form className="feedback-form" onSubmit={handleSubmit}>
          <h2
            style={{
              textAlign: "center",
              color: "red",
              fontSize: "30px",
              fontFamily: "cursive",
            }}
          >
            Submit Your Feedback
          </h2>

          {formError && <p className="error-message">{formError}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            readOnly
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
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
            <option value="">Select Rating</option>
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
          />

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Feedback List */}
      <div className="feedback-list-section">
        <h2
          style={{
            textAlign: "center",
            color: "red",
            fontSize: "30px",
            fontFamily: "cursive",
          }}
        >
          Client Feedbacks
        </h2>
        <div className="table-container-News">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Admin Reply</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList
                .filter((item) => {
                  const lowerSearch = search.toLowerCase();
                  return lowerSearch === ""
                    ? true
                    : item.name?.toLowerCase().includes(lowerSearch) ||
                        new Date(item.createdAt)
                          .toLocaleString()
                          .toLowerCase()
                          .includes(lowerSearch) ||
                        item.email?.toLowerCase().includes(lowerSearch) ||
                        item.rating?.toString().includes(lowerSearch) ||
                        item.message?.toLowerCase().includes(lowerSearch) ||
                        item.response?.toLowerCase().includes(lowerSearch);
                })
                .map((item, index) => {
                  if (!item) return null;
                  const createdAt = item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "N/A";
                  return (
                    <tr key={item._id || index}>
                      <td>{createdAt}</td>
                      <td>{item.name || "N/A"}</td>
                      <td>{item.email || "N/A"}</td>
                      <td>⭐ {item.rating || "0"}</td>
                      <td>{item.message || "-"}</td>
                      <td>{item.response || "-"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
