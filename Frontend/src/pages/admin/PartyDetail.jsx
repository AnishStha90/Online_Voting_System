import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PartyDetail() {
  const { partyId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);

  // For editing:
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
  });
  const [editError, setEditError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('You must be logged in to view members.');
      setMembers([]);
      return;
    }

    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/partyMembers/byParty/${partyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMembers(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load members.');
        setMembers([]); // Clear members on error
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [partyId, token]);

  // Start editing a member: fill form with current data
  const handleEdit = (member) => {
    setEditingMemberId(member._id);
    setEditFormData({
      name: member.name || '',
      phone: member.phone || '',
      email: member.email || '',
      dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split('T')[0] : '',
    });
    setEditError(null);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditCancel = () => {
    setEditingMemberId(null);
    setEditError(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/partyMembers/${editingMemberId}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update member list with updated data
      setMembers((prev) =>
        prev.map((m) => (m._id === editingMemberId ? res.data : m))
      );

      setEditingMemberId(null);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update member.');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete handler
  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/partyMembers/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(members.filter((m) => m._id !== memberId));
      setError(null);
      if (editingMemberId === memberId) {
        // If currently editing this member, close the form
        setEditingMemberId(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete member.');
    }
  };

  if (loading) return <div>Loading members...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto', fontFamily: 'Arial' }}>
            {/* Spacer div */}
<div style={{ height: "3rem" }}></div>
      <h2 style={{ textAlign: 'center' }}>Party Members</h2>
      {/* Spacer div */}
<div style={{ height: "3rem" }}></div>
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
              // EDIT FORM
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
              // MEMBER CARD
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
                  <p style={{ margin: '0.25rem 0' }}>📞 {member.phone}</p>
                  <p style={{ margin: '0.25rem 0' }}>✉️ {member.email}</p>
                  <p style={{ margin: '0.25rem 0' }}>
                    🎂 {new Date(member.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <button
                    onClick={() => handleEdit(member)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: 20 }}>
        ← Back
      </button>
    </div>
  );
}
