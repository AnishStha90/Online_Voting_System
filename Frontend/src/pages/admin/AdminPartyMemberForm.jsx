import React, { useState, useEffect } from 'react';
import { createPartyMember } from '../../api/partyMemberApi';
import { getAllParties } from '../../api/partyApi';

const positions = ["President", "Vice President", "Secretary", "Treasurer", "Member"];
const genders = ["Male", "Female", "Other"];

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone); // Validates exactly 10 digits
}

const AdminPartyMemberForm = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    party: '',
    position: '',
    image: null,
  });

  const [parties, setParties] = useState([]);
  const [loadingParties, setLoadingParties] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!form.position) {
      setSubmitError('Please select a position.');
      return;
    }

    if (!form.gender) {
      setSubmitError('Please select a gender.');
      return;
    }

    if (!isValidPhone(form.phone)) {
      setSubmitError('Invalid phone number. Must be exactly 10 digits.');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      await createPartyMember(formData);
      setSubmitSuccess('Party Member Created Successfully');
      setForm({
        name: '',
        phone: '',
        email: '',
        gender: '',
        dateOfBirth: '',
        party: '',
        position: '',
        image: null,
      });
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
        placeholder="Phone (10 digits)"
        value={form.phone}
        onChange={(e) => {
          const onlyDigits = e.target.value.replace(/\D/g, '');
          if (onlyDigits.length <= 10) {
            setForm((prev) => ({ ...prev, phone: onlyDigits }));
          }
        }}
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

      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Gender --</option>
        {genders.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

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

      <select
        name="position"
        value={form.position}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Position --</option>
        {positions.map((pos) => (
          <option key={pos} value={pos}>
            {pos}
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
