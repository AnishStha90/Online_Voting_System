// src/pages/admin/AdminSidebar.jsx
import {
  Typography,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  FlagIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon, // ✅ Added
} from "@heroicons/react/24/solid";
import { NavLink, useNavigate } from "react-router-dom";
import '../../Sidebar.css';  // Custom CSS for sidebar

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user auth info here
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="admin-sidebar">
      <Typography variant="h5" color="blue-gray" className="mb-6">
        Admin Panel
      </Typography>
      <nav>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <PresentationChartBarIcon className="icon" />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <UserCircleIcon className="icon" />
          Profile
        </NavLink>

        <NavLink
          to="/admin/election"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FlagIcon className="icon" />
          Election
        </NavLink>

        <NavLink
          to="/admin/party"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FlagIcon className="icon" />
          Party
        </NavLink>

        <NavLink
          to="/admin/voters"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <UsersIcon className="icon" />
          Voters
        </NavLink>

        {/* ✅ Add Party Member link */}
        <NavLink
          to="/admin/partymembers/new"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <UserPlusIcon className="icon" />
          Add Party Member
        </NavLink>

        {/* 🔴 Logout Button */}
        <button
          onClick={handleLogout}
          type="button"
          className="custom-logout-btn"
        >
          <ArrowRightOnRectangleIcon className="custom-logout-icon" />
          <span className="logout-text">Logout</span>
        </button>
      </nav>
    </div>
  );
}
