import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../App.css";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="loading-text">Loading profile...</p>;
  if (!user) return <p className="error-text">Unable to load profile.</p>;

  return (
    <div className="container">
      <div className="left-panel">
        <div className="card">
          {user.image && (
            <img
              src={`http://localhost:5000/${user.image}`}
              alt="Profile"
              className="profile-img"
            />
          )}
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Age:</strong> {new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>District:</strong> {user.district}</p>
          <p><strong>Gender:</strong>{user.gender}</p>
          <p><strong>Role:</strong> <span className="voted-status">Administrator</span></p>
        </div>
      </div>
      <div className="right-panel">
        <h1>Welcome back, <span className="highlight">{user.name.split(" ")[0]}</span></h1>
        <h2>Administrator Dashboard</h2>
        <p className="subheading">Manage and Oversee Platform Operations</p>
        <p>
          As an administrator, you have full access to manage elections, voters, and platform settings.
          Ensure that the voting process runs smoothly and securely by monitoring user activities,
          updating election details, and addressing any issues promptly. Your role is critical in
          maintaining the integrity and transparency of the online voting system.
        </p>
        <p>
          Use the sidebar to navigate through your dashboard, review user profiles, manage elections,
          and monitor voter participation. Thank you for your dedication to upholding a fair and
          democratic voting process.
        </p>
      </div>
    </div>
  );
}
