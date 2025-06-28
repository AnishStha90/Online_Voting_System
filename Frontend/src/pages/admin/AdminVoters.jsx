import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllUsers,
  registerUser,
  updateProfile,
  deleteUser,
} from '../../api/userAPI'; // You need to implement these API calls

const AdminVoters = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    district: '',
    imageFile: null,
  });
  const [editId, setEditId] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      if (!editId) formData.append('password', form.password); // Only send password when creating
      formData.append('phone', form.phone);
      formData.append('dateOfBirth', form.dateOfBirth);
      formData.append('district', form.district);
      if (form.imageFile) {
        formData.append('image', form.imageFile);
      }

      if (editId) {
        await updateProfile(editId, formData, token);
        setEditId(null);
      } else {
        await registerUser(formData, token);  // <-- fixed here: createUser -> registerUser
      }

      setForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        dateOfBirth: '',
        district: '',
        imageFile: null,
      });
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
      district: user.district,
      imageFile: null,
    });
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id, token);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleDetail = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  const handleFileChange = (e) => {
    setForm({ ...form, imageFile: e.target.files[0] });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>User Manager</h2>
      {error && <div style={styles.error}>Error: {error}</div>}

      <div style={styles.listContainer}>
        {users.map((user) => (
          <div key={user._id} style={styles.userCard}>
            <h3>{user.name}</h3>
            <img
              src={user.image ? `http://localhost:5000/${user.image}` : 'https://via.placeholder.com/80'}
              alt={`${user.name} avatar`}
              width={80}
              height={80}
              style={{ objectFit: 'cover', borderRadius: '50%', marginBottom: 10 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/80';
              }}
            />
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Date of Birth:</strong> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
            <p><strong>District:</strong> {user.district}</p>
            <div style={styles.buttonGroup}>
              
              <button onClick={() => handleDelete(user._id)} style={styles.deleteBtn}>Delete</button>
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
  cancelBtn: {
    padding: '0.6rem',
    fontSize: '1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default AdminVoters;
