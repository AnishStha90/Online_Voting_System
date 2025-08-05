import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const sendFeedback = async (email, message) => {
  const res = await axios.post(
    `${API_BASE}/feedback`,
    { email, message },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

export const getFeedbackByEmail = async (email) => {
  const encodedEmail = encodeURIComponent(email.trim());
  const res = await axios.get(
    `${API_BASE}/feedback/user-email/${encodedEmail}`,
    { headers: getAuthHeaders() }
  );
  return res.data;
};
