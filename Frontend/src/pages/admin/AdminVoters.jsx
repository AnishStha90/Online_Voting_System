import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllUsers,
  registerUser,
  updateProfile,
  deleteUser,
} from '../../api/userAPI';

import {
  EnvelopeIcon,
  PhoneIcon,
  CakeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const AdminVoters = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id, token);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Voter Management</h2>
      {error && <div style={styles.error}>Error: {error}</div>}

      <div style={styles.listContainer}>
        {users
          .filter((user) => user.role === 'voter')
          .map((user) => (
            <div key={user._id} style={styles.userCard}>
              <h3>{user.name}</h3>
              <img
                src={
                  user.image
                    ? `http://localhost:5000/${user.image}`
                    : 'https://via.placeholder.com/80'
                }
                alt={`${user.name} avatar`}
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: '50%', marginBottom: 10 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/80';
                }}
              />
              <p style={styles.iconText}>
                <EnvelopeIcon style={styles.icon} /> {user.email}
              </p>
              <p style={styles.iconText}>
                <PhoneIcon style={styles.icon} /> {user.phone}
              </p>
              <p style={styles.iconText}>
                <CakeIcon style={styles.icon} />{' '}
                {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}
              </p>
              <p style={styles.iconText}>
                <MapPinIcon style={styles.icon} /> {user.district}
              </p>
              <div style={styles.buttonGroup}>
                <button onClick={() => handleDelete(user._id)} style={styles.deleteBtn}>
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    background: '#f9f9f9',
  },
  header: {
    fontSize: '2rem',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '2rem',
    justifyContent: 'center',
  },
  userCard: {
    background: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    width: '30%',
    minWidth: '250px',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  iconText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    margin: '4px 0',
  },
  icon: {
    width: '18px',
    height: '18px',
    color: '#333',
  },
};

export default AdminVoters;
