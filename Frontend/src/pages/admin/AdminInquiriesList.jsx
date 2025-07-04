import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../api/authToken";

const API_BASE = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminInquiries = () => {
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = getToken();

  const fetchInquiries = async () => {
    if (!token) {
      setError("You must be logged in to view inquiries.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/inquires`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to fetch inquiries");
      }

      const data = await res.json();

      if (!data.success && data.data === undefined) {
        throw new Error(data.message || "Failed to load inquiries");
      }

      // assuming inquiries array is in data.data or data directly, adjust if needed
      setInquiries(data.data || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (!token) {
      alert("You must be logged in to delete inquiries.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const res = await fetch(`${API_BASE}/inquires/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to delete inquiry");
      }

      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Failed to delete inquiry");

      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFeedback = (id) => {
    // Navigate to AdminFeedback page with inquiry ID param
    navigate(`/admin/feedback/${id}`);
  };

  if (loading) return <p>Loading inquiries...</p>;

  if (error)
    return (
      <p style={{ color: "red", maxWidth: 700, margin: "1rem auto", textAlign: "center" }}>
        Error: {error}
      </p>
    );

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admin - Inquiries List</h2>
      {inquiries.length === 0 ? (
        <p>No inquiries available.</p>
      ) : (
        <div style={styles.listContainer}>
          {inquiries.map(({ _id, name, email, message, createdAt }) => (
            <div key={_id} style={styles.inquiryCard}>
              <div style={styles.inquiryHeader}>
                <div>
                  <strong>{name}</strong> - <small>{new Date(createdAt).toLocaleString()}</small>
                </div>
                <div>
                  <button
                    style={styles.detailBtn}
                    onClick={() => setSelectedId(selectedId === _id ? null : _id)}
                  >
                    {selectedId === _id ? "Hide Details" : "Details"}
                  </button>
                  <button style={styles.feedbackBtn} onClick={() => handleFeedback(_id)}>
                    Feedback
                  </button>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(_id)}>
                    Delete
                  </button>
                </div>
              </div>
              {selectedId === _id && (
                <div style={styles.detailsBox}>
                  <p>
                    <strong>Email:</strong> {email}
                  </p>
                  <p>
                    <strong>Message:</strong> {message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    background: "#f9f9f9",
    maxWidth: 700,
    margin: "0 auto",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "1rem",
    textAlign: "center",
    color: "#333",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  inquiryCard: {
    background: "#fff",
    padding: "1rem",
    borderRadius: 8,
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  },
  inquiryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  detailBtn: {
    marginRight: 10,
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: 4,
    padding: "0.3rem 0.7rem",
    cursor: "pointer",
  },
  feedbackBtn: {
    marginRight: 10,
    backgroundColor: "#ffc107",
    color: "#212529",
    border: "none",
    borderRadius: 4,
    padding: "0.3rem 0.7rem",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: 4,
    padding: "0.3rem 0.7rem",
    cursor: "pointer",
  },
  detailsBox: {
    marginTop: 10,
    backgroundColor: "#f1f1f1",
    padding: "0.7rem",
    borderRadius: 4,
    whiteSpace: "pre-wrap",
  },
};

export default AdminInquiries;
