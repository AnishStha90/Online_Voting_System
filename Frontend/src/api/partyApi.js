import axios from 'axios';
import { getToken } from './authToken'; // Your JWT token handler

const API_BASE = 'http://localhost:5000/api/parties';
const PARTY_MEMBERS_API_BASE = 'http://localhost:5000/api/partymembers';

const authHeaders = () => {
  const token = getToken() || localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Get all parties
export const getAllParties = async () => {
  const res = await axios.get(API_BASE, authHeaders());
  return res.data;
};

// ✅ Get a single party by ID
export const getPartyById = async (id) => {
  const res = await axios.get(`${API_BASE}/${id}`, authHeaders());
  return res.data;
};

// ✅ Create a new party (multipart/form-data)
export const createParty = async (formData) => {
  const res = await axios.post(API_BASE, formData, {
    ...authHeaders(),
    headers: {
      ...authHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// ✅ Update an existing party
export const updateParty = async (id, formData) => {
  const res = await axios.put(`${API_BASE}/${id}`, formData, {
    ...authHeaders(),
    headers: {
      ...authHeaders().headers,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// ✅ Delete a party
export const deleteParty = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`, authHeaders());
  return res.data;
};

// ✅ Get party members by partyId (used by voters or admins)
export const getPartyMembersByParty = async (partyId) => {
  const res = await axios.get(`${API_BASE}/${partyId}/members`, authHeaders());
  return res.data;
};
