import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllParties,
  createParty,
  updateParty,
  deleteParty,
} from '../../api/partyApi';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/solid';

const AdminParty = () => {
  const [parties, setParties] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    affiliatedPoliticalParty: '',
    establishedYear: '',
    symbolFile: null,
  });
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
      formData.append('affiliatedPoliticalParty', form.affiliatedPoliticalParty);

      if (form.establishedYear) {
        const yearNum = parseInt(form.establishedYear, 10);
        if (isNaN(yearNum) || yearNum < 1800 || yearNum > 3000) {
          setError('Established year must be a valid year between 1800 and 3000.');
          return;
        }
        formData.append('establishedDate', `${yearNum}-01-01`);
      }

      if (form.symbolFile) {
        formData.append('symbol', form.symbolFile);
      }

      if (editId) {
        await updateParty(editId, formData, token);
        setEditId(null);
      } else {
        await createParty(formData, token);
      }

      setForm({
        name: '',
        description: '',
        affiliatedPoliticalParty: '',
        establishedYear: '',
        symbolFile: null,
      });
      fetchParties();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  const handleEdit = (party) => {
    setForm({
      name: party.name || '',
      description: party.description || '',
      affiliatedPoliticalParty: party.affiliatedPoliticalParty || '',
      establishedYear: party.establishedDate
        ? new Date(party.establishedDate).getFullYear().toString()
        : '',
      symbolFile: null,
    });
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
            <div style={styles.buttonGroup}>
              <button
                onClick={() => handleDetail(party._id)}
                style={styles.iconBtn}
                title="View Details"
              >
                <EyeIcon style={styles.icon} />
              </button>
              <button
                onClick={() => handleEdit(party)}
                style={styles.iconBtn}
                title="Edit Party"
              >
                <PencilSquareIcon style={styles.icon} />
              </button>
              <button
                onClick={() => handleDelete(party._id)}
                style={styles.iconBtn}
                title="Delete Party"
              >
                <TrashIcon style={{ ...styles.icon, color: '#dc3545' }} />
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
          <input
            type="text"
            placeholder="Affiliated Political Party"
            value={form.affiliatedPoliticalParty}
            onChange={(e) =>
              setForm({ ...form, affiliatedPoliticalParty: e.target.value })
            }
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Established Year (e.g. 1990)"
            value={form.establishedYear}
            onChange={(e) =>
              setForm({ ...form, establishedYear: e.target.value })
            }
            style={styles.input}
            min={1800}
            max={3000}
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
                  setForm({
                    name: '',
                    description: '',
                    affiliatedPoliticalParty: '',
                    establishedYear: '',
                    symbolFile: null,
                  });
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
    justifyContent: 'center',
    gap: '0.5rem',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.3rem',
  },
  icon: {
    width: '24px',
    height: '24px',
    color: '#333',
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
