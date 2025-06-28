import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllElections } from '../api/electionApi';

import "../Election.css";

const ElectionsList = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must login first.');
      navigate('/login'); // redirect to login page
      return;
    }

    const fetchElections = async () => {
      try {
        const data = await getAllElections();
        setElections(data);
      } catch (err) {
        setError('Failed to fetch elections.');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [navigate]);

  if (loading) return <p>Loading elections...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (elections.length === 0) return <p>No elections available.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow mt-6">
       {/* Spacer div */}
<div style={{ height: "3rem" }}></div>
      <h1 className="text-3xl font-bold mb-6">Available Elections</h1>
 {/* Spacer div */}
<div style={{ height: "3rem" }}></div>
      <div className="elections-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        {elections.map((election) => (
          <div key={election._id} className="election-card p-4 border rounded shadow hover:shadow-lg transition">
            <Link to={`/elections/${election._id}`} className="election-title text-xl font-semibold hover:underline">
              {election.title}
            </Link>
            <p className="election-description mt-2 mb-4 text-gray-600">{election.description}</p>

            <div className="flex gap-4">
              <Link
                to={`/elections/${election._id}/results`}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                aria-label={`View live results for ${election.title}`}
              >
                Live Results
              </Link>
            </div>
          </div>
        ))}
      </div>
       {/* Spacer div */}
<div style={{ height: "3rem" }}></div>
    </div>
    
  );
};

export default ElectionsList;
