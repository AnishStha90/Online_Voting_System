import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // <-- Import useNavigate

const API_BASE = 'http://localhost:5000/api';

const UserFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();  // <-- Initialize navigate

  const email = localStorage.getItem("email")?.trim();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!email) {
      console.error("Email not found in localStorage!");
      setError("Email not found. Please login again.");
      setLoading(false);
      return;
    }

    const fetchFeedback = async () => {
      try {
        const url = `${API_BASE}/feedback/user-email/${encodeURIComponent(email)}`;
        console.log("Fetching feedback from:", url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API response:", response.data);

        if (response.data.success) {
          setFeedbacks(response.data.data);
          setError("");
        } else {
          setError(response.data.message || "No feedback found.");
          setFeedbacks([]);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Failed to load feedback.");
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [email, token]);

  if (loading) return <p>Loading feedback...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!feedbacks.length) return <p>No feedback yet.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "1rem" }}>
      <h2>Your Feedback</h2>
      {feedbacks.map((fb) => (
        <div
          key={fb._id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: 6,
          }}
        >
          <p><strong>Message:</strong> {fb.message}</p>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            Sent on: {new Date(fb.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
<<<<<<< HEAD
      <button
  onClick={() => navigate(-1)}
  style={{
    marginTop: '1rem',
    padding: '8px 16px',
    backgroundColor: '#6c757d', // Gray color
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '14px',
  }}
>
  ← Back
</button>

=======
      <button onClick={() => navigate(-1)} style={{ marginTop: 20 }}>
        ← Back
      </button>
>>>>>>> 85e5ef3cb1d1526f9277237b44e4d31e70cbc94b
    </div>
  );
};

export default UserFeedback;
