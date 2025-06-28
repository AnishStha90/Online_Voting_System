import React, { useEffect, useState } from 'react';
import { getAllParties } from '../api/partyApi';
import { useNavigate } from 'react-router-dom';

export default function PartyList() {
  const [parties, setParties] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view parties.');
      return;
    }

    getAllParties(token)
      .then(data => setParties(data))
      .catch(err => setError(err.message));
  }, [token]);

  if (error)
    return (
      <div style={{ color: 'red', padding: '1rem' }}>
        Error: {error}
      </div>
    );

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '2rem auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Party List</h2>

      {/* Use a div as grid container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}
      >
        {parties.map((party) => (
          <div
            key={party._id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onClick={() => navigate(`/party/${party._id}/members`)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src={`http://localhost:5000/${party.symbol}`}
              alt={`${party.name} symbol`}
              width={80}
              height={80}
              style={{ borderRadius: '8px', objectFit: 'contain', marginBottom: '1rem' }}
            />
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{party.name}</h3>
            <p style={{ color: '#555', marginBottom: '1rem' }}>{party.description}</p>
            <button
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#007bff',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease',
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/party/${party._id}/members`);
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
            >
              Details
            </button>
          </div>
        ))}
      </div>
   
    </div>
  );
}
