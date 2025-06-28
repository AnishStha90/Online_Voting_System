import React, { useState, useEffect } from 'react';
import { createPartyMember } from '../../api/partyMemberApi';
import { getAllParties } from '../../api/partyApi';

const AdminPartyMemberForm = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    party: '',
    image: null,
  });

  const [parties, setParties] = useState([]);
  const [loadingParties, setLoadingParties] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Fetch parties on mount
  useEffect(() => {
    const fetchParties = async () => {
      setLoadingParties(true);
      setError(null);
      try {
        const data = await getAllParties();
        setParties(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch parties.');
        console.error('Failed to fetch parties:', err);
      } finally {
        setLoadingParties(false);
      }
    };
    fetchParties();
  }, []);

  // Handle normal input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] || null }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      await createPartyMember(formData);
      setSubmitSuccess('Party Member Created Successfully');

      // Reset form
      setForm({
        name: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        party: '',
        image: null,
      });
      // Reset file input manually
      document.getElementById('imageInput').value = '';
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Error occurred during creation.');
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <input
        name="name"
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="phone"
        type="text"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="dateOfBirth"
        type="date"
        value={form.dateOfBirth}
        onChange={handleChange}
        required
      />

      <select
        name="party"
        value={form.party}
        onChange={handleChange}
        required
        disabled={loadingParties}
      >
        <option value="">-- Select Party --</option>
        {loadingParties && <option disabled>Loading parties...</option>}
        {!loadingParties &&
          parties.map((party) => (
            <option key={party._id} value={party._id}>
              {party.name}
            </option>
          ))}
      </select>

      <input
        id="imageInput"
        name="image"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        required
      />

      <button type="submit">Create Member</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      {submitSuccess && <p style={{ color: 'green' }}>{submitSuccess}</p>}
    </form>
  );
};

export default AdminPartyMemberForm;
