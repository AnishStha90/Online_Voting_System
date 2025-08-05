import axios from 'axios';
import { getToken } from './authToken'; // Your JWT token handler

const API_BASE = 'http://localhost:5000/api/parties';

const authHeaders = () => {
  const token = getToken() || localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Get all parties
export const getAllParties = async () => {
  const res = await axios.get(API_BASE, { headers: authHeaders() });
  return res.data;
};

// ✅ Get a single party by ID
export const getPartyById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`, { headers: authHeaders() });
  return res.data;
};

// ✅ Create a new party (multipart/form-data)
export const createParty = async (formData) => {
  const res = await axios.post(API_BASE, formData, {
    headers: {
      ...authHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// ✅ Update an existing party
export const updateParty = async (id, formData) => {
  const res = await axios.put(`${API_BASE}/${id}`, formData, {
    headers: {
      ...authHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// ✅ Delete a party
export const deleteParty = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`, { headers: authHeaders() });
  return res.data;
};

// ✅ Get party members by partyId (used by voters or admins)
export const getPartyMembersByParty = async (partyId) => {
  const res = await axios.get(`${API_BASE}/${partyId}/members`, { headers: authHeaders() });
  return res.data;
};
