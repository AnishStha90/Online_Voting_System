import axios from 'axios';

const API_URL = 'http://localhost:5000/api/partymembers';

// Get the Authorization header object (returns empty object if no token)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Assuming JWT is stored here
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create new member (with image upload)
export const createPartyMember = async (data) => {
  return axios.post(API_URL, data, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    }
  });
};

// Get all members
export const getAllPartyMembers = async () => {
  return axios.get(API_URL, {
    headers: {
      ...getAuthHeaders(),
    }
  });
};

// Get single member
export const getPartyMemberById = async (id) => {
  return axios.get(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    }
  });
};

// Update member (with image upload support)
export const updatePartyMember = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    }
  });
};

// Delete member
export const deletePartyMember = async (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      ...getAuthHeaders(),
    }
  });
};

// Get members by partyId
export const getMembersByParty = async (partyId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/byparty/${partyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMembersByPartyId = async (partyId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/byParty/${partyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get a party member by ID (Public access, no auth token required)
export const getPublicPartyMemberById = async (id) => {
  const response = await axios.get(`${API_URL}/public/${id}`);
  return response.data;
};
