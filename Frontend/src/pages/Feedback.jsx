import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (!emailParam) return;

    setEmail(emailParam);
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`${API_BASE}/feedback/email/${emailParam}`);
        setFeedbacks(res.data || []);
      } catch (error) {
        console.error("Failed to load feedback:", error);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [location.search]);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Your Feedback</h2>

        {loading ? (
          <p>Loading feedback...</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedback found for {email}</p>
        ) : (
          <ul className="space-y-4">
            {feedbacks.map((item) => (
              <li key={item._id} className="bg-gray-50 p-4 rounded-md shadow-sm">
                <p className="text-gray-800">{item.message}</p>
                <p className="text-sm text-gray-500 text-right">
                  - Admin ({new Date(item.createdAt).toLocaleString()})
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Feedback;
