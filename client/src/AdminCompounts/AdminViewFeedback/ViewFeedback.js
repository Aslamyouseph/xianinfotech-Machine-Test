import React, { useState, useEffect, useContext } from "react";
import "./ViewFeedback.css";
import { Link } from "react-router-dom";
import { SearchContext } from "../../SearchContext";

function ViewFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const { search } = useContext(SearchContext);

  // Fetch feedback from backend API
  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/getFeedBack", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch feedback.");

        const data = await res.json();
        setFeedback(data.Feedback || []);
      } catch (err) {
        console.error("Error:", err);
        setError("Something went wrong. Please try again.");
      }
    };

    fetchFeedbackDetails();
  }, []);

  // Handle delete
  const handleDelete = async (feedbackItem) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete: "${feedbackItem.message}"?`
    );
    if (!confirmDelete) return;

    setDeletingId(feedbackItem._id);

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/deleteFeedBack/${feedbackItem._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to delete feedback");

      setFeedback((prev) =>
        prev.filter((item) => item._id !== feedbackItem._id)
      );
      alert("Feedback deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <br />
      <br />
      <h1 className="Managing-heading">Remove or Update Feedback</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="table-container-News">
        <br />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Message From User</th>
              <th>Respond By Admin</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {feedback
              .filter((item) => {
                const lowerSearch = search.toLowerCase();
                return lowerSearch === ""
                  ? true
                  : item.name.toLowerCase().includes(lowerSearch) ||
                      new Date(item.createdAt)
                        .toLocaleString()
                        .toLowerCase()
                        .includes(lowerSearch) ||
                      item.email.toLowerCase().includes(lowerSearch) ||
                      item.rating
                        .toString()
                        .toLowerCase()
                        .includes(lowerSearch) ||
                      item.message.toLowerCase().includes(lowerSearch) ||
                      (item.response &&
                        item.response.toLowerCase().includes(lowerSearch));
              })
              .map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>⭐ {item.rating}</td>
                  <td>{item.message}</td>
                  <td>{item.response}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item._id}
                    >
                      {deletingId === item._id ? "Deleting..." : "Delete"}
                    </button>
                    <br />
                    <br />
                    <Link
                      to={`/RespondToFeedback/${item._id}`}
                      className="update-btn"
                    >
                      Respond to Feedback
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewFeedback;
