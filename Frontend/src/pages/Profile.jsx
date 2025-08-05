import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

export default function Profile() {
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

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

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
          <p><strong>Age:</strong> {calculateAge(user.dateOfBirth)}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>District:</strong> {user.district}</p>
          <p><strong>Student ID:</strong> {user.studentid}</p>
          <p><strong>Verification:</strong> 
            <span className={user.isVerified ? "verified" : "not-verified"}>
              {user.isVerified ? "Verified" : "Not Verified"}
            </span>
          </p>
        </div>
      </div>

      <div className="right-panel">
        <h1>Welcome <span className="highlight">{user.name.split(" ")[0]}</span></h1>
        <h2>Welcome to Online Voting Platform</h2>
        <p className="subheading">Exercise Your Right to Vote Anytime, Anywhere</p>
        <p>
          Welcome to our online voting platform, where your voice matters. With the convenience
          of modern technology, we bring democracy to your fingertips, enabling you to participate
          in important decisions and elections from the comfort of your own home. Our secure and
          user-friendly platform ensures that your vote is counted accurately and confidentially.
        </p>
      </div>
    </div>
  );
}
