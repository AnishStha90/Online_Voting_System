import axios from './axios'; // use the configured axios instance

// Submit votes to backend
export const submitVote = async (electionId, votes) => {
  try {
    const response = await axios.post('/votes/submit', { electionId, votes });
    return response.data; // e.g. { message: 'Vote submitted successfully' }
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Check if user has already voted in an election
export const checkVote = async (electionId) => {
  try {
    const response = await axios.get(`/votes/check/${electionId}`);
    return response.data; // e.g. { voted: true/false, message: '...' }
  } catch (error) {
    throw error.response?.data || error;
  }
};
