import axios from "axios";

const API_BASE = "http://localhost:5000/api/inquires";

// Create new inquiry (public)
export const createInquire = async (data) => {
  return await axios.post(API_BASE, data);
};

// Get all inquiries (admin, authenticated)
export const getAllInquires = async (token) => {
  return await axios.get(API_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get inquiry by ID (admin, authenticated)
export const getInquireById = async (id, token) => {
  return await axios.get(`${API_BASE}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
