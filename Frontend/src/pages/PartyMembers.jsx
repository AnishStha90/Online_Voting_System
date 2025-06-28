import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PartyMembers() {
  const { partyId } = useParams();
  const navigate = useNavigate(); // ✅ Fix for navigation
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view members.');
      return;
    }

    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/partyMembers/byParty/${partyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMembers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load members.');
      }
    };

    fetchMembers();
  }, [partyId, token]);

  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', fontFamily: 'Arial' }}>
     

      <h2 style={{ textAlign: 'center' }}>Party Members</h2>
 {/* Spacer div */}
<div style={{ height: "3rem" }}></div>
      {members.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No members found for this party.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {members.map((member) => (
            <div
              key={member._id}
              style={{
                display: 'flex',
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 16,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
              }}
            >
              {member.image ? (
                <img
                  src={`http://localhost:5000/${member.image}`}
                  alt={member.name}
                  width={80}
                  height={80}
                  style={{
                    borderRadius: 6,
                    objectFit: 'cover',
                    marginRight: 16,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#eee',
                    borderRadius: 6,
                    marginRight: 16,
                  }}
                />
              )}
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0' }}>{member.name}</h3>
                <p style={{ margin: '0.25rem 0' }}>📞 {member.phone}</p>
                <p style={{ margin: '0.25rem 0' }}>✉️ {member.email}</p>
                <p style={{ margin: '0.25rem 0' }}>
                  🎂 {new Date(member.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
       {/* Spacer div */}
<div style={{ height: "3rem" }}></div>
       <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
        ← Back
      </button>
    </div>
  );
}
