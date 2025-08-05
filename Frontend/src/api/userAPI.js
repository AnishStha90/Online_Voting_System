import axios from "axios";

const API_BASE = "http://localhost:5000/api/users"; // change if needed

// Register user
export const registerUser = async (formData) => {
  const response = await axios.post(`${API_BASE}/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Login with email & password (step 1)
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE}/login`, { email, password });
  
  // Save token in localStorage if login successful
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Verify login OTP (step 2)
export const verifyLoginOTP = async (email, otp) => {
  const response = await axios.post(`${API_BASE}/verify-login-otp`, { email, otp });
  return response.data;
};

// Get profile (requires JWT token)
export const getProfile = async (token) => {
  const response = await axios.get(`${API_BASE}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update profile
export const updateProfile = async (token, data) => {
  const response = await axios.put(`${API_BASE}/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a user (admin use)
export const deleteUser = async (id, token) => {
  const response = await axios.delete(`${API_BASE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get all users (admin use)
export const getAllUsers = async (token) => {
  const response = await axios.get(`${API_BASE}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.users || response.data;
};
