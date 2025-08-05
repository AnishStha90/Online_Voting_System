import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminFeedback = () => {
  const { id } = useParams(); // Get inquiry ID from URL
  const navigate = useNavigate();

  const [inquiry, setInquiry] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Fetch inquiry details by ID
  const fetchInquiry = async () => {
    try {
      const res = await axios.get(`${API_BASE}/inquires/${id}`, {
        headers: getAuthHeaders(),
      });

      // ✅ Fix: set only the actual inquiry data
      setInquiry(res.data.data);
    } catch (err) {
      setError("Failed to load inquiry");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiry();
  }, [id]);

  // Handle reply form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      setError("Reply message cannot be empty");
      return;
    }

    setSending(true);
    setError("");

    try {
      await axios.put(
        `${API_BASE}/inquires/${id}/reply`,
        { replyMessage },
        {
          headers: getAuthHeaders(),
        }
      );

      alert("Reply sent successfully");
      navigate("/admin/inquires"); // ✅ Use absolute path
    } catch (err) {
      setError("Failed to send reply");
      console.error("Reply error:", err);
    } finally {
      setSending(false);
    }
  };

  // Handle loading and not found states
  if (loading) return <p>Loading inquiry...</p>;
  if (!inquiry) return <p>Inquiry not found.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Reply to Inquiry from {inquiry.name}</h2>
      <p>
        <strong>Email:</strong> {inquiry.email}
      </p>
      <p>
        <strong>Message:</strong> {inquiry.message}
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
        <label>
          Your Reply:
          <textarea
            rows="5"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Write your feedback or reply here"
            style={{ width: "100%", marginTop: 8 }}
            required
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          disabled={sending}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: sending ? "not-allowed" : "pointer",
          }}
        >
          {sending ? "Sending..." : "Send Reply"}
        </button>
      </form>
    </div>
  );
};

export default AdminFeedback;
