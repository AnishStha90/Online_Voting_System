import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Home() {
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ New state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // ✅ Set login state
    }

    const fetchElections = async () => {
      if (!token) {
        setError("You must be logged in to view elections.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/elections", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Unauthorized. Please log in again.");
          }
          throw new Error("Failed to fetch elections.");
        }

        const data = await res.json();
        setElections(data.elections || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const now = new Date();
  const filteredElections = elections.filter(
    (election) => new Date(election.endDate) >= now
  );

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Empowering Democracy</h1>
        <p>Your voice matters — vote now, shape tomorrow.</p>
        {!isLoggedIn && (
          <button className="hero-button" onClick={() => navigate('/login')}>
            Get Started
          </button>
        )}
      </section>

      {/* Loading/Error */}
      {loading && <p>Loading elections...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Election List */}
      {!loading && !error && (
        <section className="election-section">
          <h2>Ongoing Elections</h2>
          <div className="election-cards">
            {filteredElections.length === 0 ? (
              <p>No ongoing elections.</p>
            ) : (
              filteredElections.map((election) => (
                <div className="card" key={election._id}>
                  <h3>{election.title}</h3>
                  <p>{election.description}</p>
                  <p>
                    <strong>Ends on:</strong>{" "}
                    {new Date(election.endDate).toLocaleDateString()}
                  </p>
                  <Link to={`/elections/${election._id}`}>
                    <button className="vote-button">
                      Participate
                    </button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
