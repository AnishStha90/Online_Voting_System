import React, { useState } from "react";
import '../app.css'; // Adjust the path if needed
import { registerUser } from "../api/userAPI"; // Adjust this path too
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    district: "",
    dateOfBirth: "",
    gender: "",
    voterid: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) return alert("Name is required");
    if (!emailRegex.test(formData.email)) return alert("Invalid email");
    if (formData.password.length < 6) return alert("Password must be at least 6 characters");
    if (!/^\d{10}$/.test(formData.phone)) return alert("Phone must be exactly 10 digits");
    if (!formData.district.trim()) return alert("District is required");
    if (!formData.dateOfBirth) return alert("Date of birth is required");
    if (!formData.gender) return alert("Gender is required");
    if (!formData.voterid.trim()) return alert("Voter ID is required");
    if (!imageFile) return alert("User photo is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append("image", imageFile);

      const result = await registerUser(data);
      alert(result.message || "Registered successfully! Please verify your email.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        district: "",
        dateOfBirth: "",
        gender: "",
        voterid: "",
      });
      setImageFile(null);
    } catch (err) {
      alert("Server error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <input
        name="name"
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={6}
      />

      <input
        name="phone"
        type="text"
        placeholder="Phone (10 digits)"
        value={formData.phone}
        onChange={handleChange}
        required
        maxLength={10}
      />

      <input
        name="district"
        type="text"
        placeholder="District"
        value={formData.district}
        onChange={handleChange}
        required
      />

      <label>
        Date of Birth:
        <input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Gender:
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <input
        name="voterid"
        type="text"
        placeholder="Voter ID"
        value={formData.voterid}
        onChange={handleChange}
        required
      />

      <label>
        Upload Photo:
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      <p>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "blue", textDecoration: "underline" }}>
          Login here
        </Link>
      </p>
    </form>
  );
};

export default Register;
