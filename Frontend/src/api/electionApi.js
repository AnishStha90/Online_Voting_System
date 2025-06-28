import axios from 'axios';

const API_BASE = 'http://localhost:5000/api'; // adjust if backend hosted elsewhere

// ---------- PARTY APIs ----------
export const getAllParties = async () => {
  const res = await axios.get(`${API_BASE}/parties`); // plural "parties"
  return res.data; // returns array of parties with populated members
};

export const getPartyMembers = async (partyId) => {
  // Make sure this matches your backend route exactly
  const res = await axios.get(`${API_BASE}/parties/${partyId}/members`);
  return res.data.members; // adjust according to your backend response shape
};

// ---------- ELECTION APIs ----------
export const createElection = async (data) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_BASE}/elections`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllElections = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_BASE}/elections`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.elections;
};



export const getElectionById = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE}/elections/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteElection = async (id) => {
  const res = await axios.delete(`${API_BASE}/elections/${id}`);
  return res.data;
};

export const updateElection = async (id, updatedData) => {
  const res = await axios.put(`${API_BASE}/elections/${id}`, updatedData);
  return res.data;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // adjust according to your auth setup
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPartyMembersByPartyId = async (partyId) => {
  // If this endpoint exists in your backend, otherwise remove it
  const response = await axios.get(`${API_BASE}/parties/${partyId}/members`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};


// ---------- ELECTION APIs (continued) ----------

export const getElectionResults = async (electionId) => {
  const res = await axios.get(`${API_BASE}/elections/${electionId}/results`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};
