import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllParties,
  createParty,
  updateParty,
  deleteParty,
} from '../../api/partyApi';

const AdminParty = () => {
  const [parties, setParties] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', symbolFile: null });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchParties = async () => {
    try {
      const data = await getAllParties(token);
      setParties(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      // Append symbolFile only if new file selected
      if (form.symbolFile) {
        formData.append('symbol', form.symbolFile);
      }

      if (editId) {
        await updateParty(editId, formData, token);
        setEditId(null);
      } else {
        await createParty(formData, token);
      }

      setForm({ name: '', description: '', symbolFile: null });
      fetchParties();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  const handleEdit = (party) => {
    setForm({ name: party.name, description: party.description, symbolFile: null });
    setEditId(party._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this party?')) return;
    try {
      await deleteParty(id, token);
      fetchParties();
    } catch (err) {
      setError(err.message || 'Failed to delete party');
    }
  };

  const handleDetail = (partyId) => {
    navigate(`/admin/party/${partyId}`);
  };

  const handleFileChange = (e) => {
    setForm({ ...form, symbolFile: e.target.files[0] });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Party Manager</h2>
      {error && <div style={styles.error}>Error: {error}</div>}

      <div style={styles.listContainer}>
        {parties.map((party) => (
          <div key={party._id} style={styles.partyCard}>
            <h3>{party.name}</h3>
            <img
              src={`http://localhost:5000/${party.symbol}`}
              alt={`${party.name} symbol`}
              width={60}
              height={60}
              style={{ objectFit: 'contain', marginBottom: 10 }}
            />
            <p>{party.description}</p>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => handleDetail(party._id)}
                style={styles.detailBtn}
              >
                Detail
              </button>
              <button onClick={() => handleEdit(party)} style={styles.editBtn}>
                Edit
              </button>
              <button
                onClick={() => handleDelete(party._id)}
                style={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.formContainer}>
        <h3>{editId ? 'Edit Party' : 'Add Party'}</h3>
        

<form onSubmit={handleSubmit} style={styles.form}>
  <input
    type="text"
    placeholder="Party Name"
    value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })}
    required
    style={styles.input}
  />
  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    {...(!editId && { required: true })}
    style={styles.input}
  />
  <textarea
    placeholder="Description"
    value={form.description}
    onChange={(e) => setForm({ ...form, description: e.target.value })}
    style={{ ...styles.input, height: 80 }}
  />
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <button type="submit" style={styles.submitBtn}>
      {editId ? 'Update Party' : 'Create Party'}
    </button>
    {editId && (
      <button
        type="button"
        onClick={() => {
          setEditId(null);
          setForm({ name: '', description: '', symbolFile: null });
          setError(null);
        }}
        style={{
          padding: '0.6rem',
          fontSize: '1rem',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
    )}
  </div>
</form>

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
  partyCard: {
    background: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    width: '250px',
    textAlign: 'center',
  },
  buttonGroup: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'space-around',
  },
  detailBtn: {
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  editBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  formContainer: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  submitBtn: {
    padding: '0.6rem',
    fontSize: '1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default AdminParty;
