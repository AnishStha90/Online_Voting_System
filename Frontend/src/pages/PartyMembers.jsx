import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PhoneIcon,
  EnvelopeIcon,
  CakeIcon,
  CheckBadgeIcon,
  UserIcon,
} from '@heroicons/react/24/solid';

export default function PartyDetail() {
  const { partyId } = useParams();
  const navigate = useNavigate();
  const [party, setParty] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);

  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    position: '',
    gender: '',
  });


  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view members.');
      setMembers([]);
      return;
    }

    const fetchPartyAndMembers = async () => {
      setLoading(true);
      try {
        const partyRes = await axios.get(
          `http://localhost:5000/api/parties/${partyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setParty(partyRes.data);

        const membersRes = await axios.get(
          `http://localhost:5000/api/partyMembers/byParty/${partyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMembers(membersRes.data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load party or members.'
        );
        setMembers([]);
        setParty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPartyAndMembers();
  }, [partyId, token]);

  


  

  if (loading) return <div>Loading party and members...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!party) return <div>No party data available.</div>;

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', fontFamily: 'Arial' }}>
      {/* Party Info */}
      <div
        style={{
          marginBottom: 30,
          padding: 16,
          backgroundColor: '#f9f9f9',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        <h2>{party.name}</h2>
        {party.symbol && (
          <div style={{ marginTop: 15 }}>
            <img
              src={`http://localhost:5000/${party.symbol}`}
              alt={`${party.name} symbol`}
              style={{
                maxWidth: 150,
                maxHeight: 150,
                objectFit: 'contain',
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 8,
                backgroundColor: '#fff',
              }}
            />
          </div>
        )}
        <p>
          <strong>Description:</strong>{' '}
          {party.description || 'No description provided.'}
        </p>
        <p>
          <strong>Affiliated Political Party:</strong>{' '}
          {party.affiliatedPoliticalParty || 'N/A'}
        </p>
        <p>
          <strong>Established Year:</strong>{' '}
          {party.establishedDate
            ? new Date(party.establishedDate).getFullYear()
            : 'N/A'}
        </p>
      </div>

      {/* Members Section */}
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Party Members</h2>
      {members.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No members found for this party.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {members.map((member) =>
            editingMemberId === member._id ? (
              <form
                key={member._id}
                onSubmit={handleEditSubmit}
                style={{
                  border: '1px solid #007bff',
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: '#f0f8ff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <h3>Edit Member</h3>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    required
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                  />
                </label>
                <label>
                  Date of Birth:
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editFormData.dateOfBirth}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                  />
                </label>
                <label>
                  Position:
                  <input
                    type="text"
                    name="position"
                    value={editFormData.position}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                  />
                </label>
                <label>
                  Gender:
                  <select
                    name="gender"
                    value={editFormData.gender}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 8, marginTop: 4 }}
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                {editError && (
                  <p style={{ color: 'red', margin: 0 }}>{editError}</p>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="submit"
                    disabled={editLoading}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      flexGrow: 1,
                    }}
                  >
                    {editLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    disabled={editLoading}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      flexGrow: 1,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div
                key={member._id}
                style={{
                  display: 'flex',
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  padding: 16,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  gap: 12,
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
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: '#eee',
                      borderRadius: 6,
                    }}
                  />
                )}
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 0.25rem 0' }}>{member.name}</h3>

                  <p style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PhoneIcon style={{ width: 16, height: 16, color: '#555' }} />
                    {member.phone}
                  </p>

                  <p style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <EnvelopeIcon style={{ width: 16, height: 16, color: '#555' }} />
                    {member.email}
                  </p>

                  <p style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CakeIcon style={{ width: 16, height: 16, color: '#555' }} />
                    {new Date(member.dateOfBirth).toLocaleDateString()}
                  </p>

                  <p style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckBadgeIcon style={{ width: 16, height: 16, color: '#555' }} />
                    Position: {member.position || 'N/A'}
                  </p>

                  <p style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <UserIcon style={{ width: 16, height: 16, color: '#555' }} />
                    {member.gender || 'N/A'}
                  </p>
                </div>

                
              </div>
            )
          )}
        </div>
      )}

      <button
  onClick={() => navigate(-1)}
  style={{
    marginTop: 20,
    padding: '10px 20px',
    backgroundColor: '#6c757d', // gray color
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  }}
>
  ← Back
</button>

    </div>
  );
}
