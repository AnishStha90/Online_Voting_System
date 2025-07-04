import React, { useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../App.css";

export default function Header() {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();

  const navItems = [
    { id: "home", label: "Home", path: "/home" },
    { id: "party", label: "Party", path: "/party" },
    { id: "election", label: "Election", path: "/elections" },
    {id: "contact_us", label: "Contact Us", path: "/contact_us"},
  ];

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">VoteHub</div>

        <ul className="nav-list">
          {navItems.map(({ id, label, path }) => (
            <li
              key={id}
              onClick={() => {
                setActive(id);
                navigate(path); // Navigate on click
              }}
              className={`nav-item ${active === id ? "active" : ""}`}
            >
              {label}
            </li>
          ))}
        </ul>

        <div className="icons">
          <button
            aria-label="Profile"
            title="Profile"
            className="icon-btn"
            onClick={handleProfileClick}
          >
            <FaUserCircle />
          </button>
          <button
            aria-label="Logout"
            title="Logout"
            className="icon-btn"
            onClick={handleLogoutClick}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </nav>
    </header>
  );
}
