import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/userAPI";
import { getAllParties } from "../../api/partyApi";
import { getAllElections } from "../../api/electionApi";

import {
  FaUserShield,
  FaUsers,
  FaFlag,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarAlt,
  FaHistory,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Helper to calculate age from DOB
  function getAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    const diff = Date.now() - new Date(dateOfBirth).getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  }

  // Helper to compute election status from dates
  function getElectionStatus(election) {
    const now = new Date();
    const start = new Date(election.startDate);
    const end = new Date(election.endDate);

    if (now >= start && now <= end) return "ongoing";
    if (now > end) return "completed";
    return "upcoming";
  }

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const users = await getAllUsers(token);
        const parties = await getAllParties(token);
        const elections = await getAllElections();

        // Calculate user counts
        const totalAdmins = users.filter((u) => u.role === "admin").length;
        const totalUsers = users.filter((u) => u.role === "voter").length;
        const totalUsersVoted = users.filter((u) => u.hasVoted === true).length;
        const totalUsersRemaining = totalUsers - totalUsersVoted;
        const totalParties = parties.length;

        // Calculate elections counts using computed status
        const totalOngoingElections = elections.filter(
          (e) => getElectionStatus(e) === "ongoing"
        ).length;
        const totalElectionsHeld = elections.filter(
          (e) => getElectionStatus(e) === "completed"
        ).length;

        // Age groups
        const ageGroups = [
          { label: "16-25", min: 16, max: 25 },
          { label: "26-35", min: 26, max: 35 },
          { label: "36-45", min: 36, max: 45 },
          { label: "46-60", min: 46, max: 60 },
          { label: "60+", min: 61, max: Infinity },
        ];

        const groupedAgeCounts = ageGroups.map((group) => ({
          ageGroup: group.label,
          count: users.filter((user) => {
            const age = getAge(user.dateOfBirth);
            return age !== null && age >= group.min && age <= group.max;
          }).length,
        }));

        setStats({
          totalAdmins,
          totalUsers,
          
          totalParties,
          totalOngoingElections,
          totalElectionsHeld,
          groupedAgeChartData: groupedAgeCounts,
        });

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [token]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  const iconStyle = { marginRight: 8, color: "#007bff" };

  const chartData = [
    { name: "Admins", value: stats.totalAdmins },
    { name: "Users", value: stats.totalUsers },
   
    { name: "Parties", value: stats.totalParties },
    { name: "Ongoing Elections", value: stats.totalOngoingElections },
    { name: "Elections Held", value: stats.totalElectionsHeld },
  ];

  return (
    <div
      style={{ maxWidth: 800, margin: "auto", fontFamily: "Arial, sans-serif" }}
    >
      <h1>Voting System Dashboard</h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <FaUserShield style={iconStyle} />
          <strong>Total Admins:</strong> {stats.totalAdmins}
        </li>
        <li>
          <FaUsers style={iconStyle} />
          <strong>Total Users:</strong> {stats.totalUsers}
        </li>
        <li>
          <FaFlag style={iconStyle} />
          <strong>Total Parties:</strong> {stats.totalParties}
        </li>
       
        <li>
          <FaCalendarAlt style={iconStyle} />
          <strong>Ongoing Elections:</strong> {stats.totalOngoingElections}
        </li>
        <li>
          <FaHistory style={iconStyle} />
          <strong>Elections Held Till Now:</strong> {stats.totalElectionsHeld}
        </li>
      </ul>

      <h2 style={{ marginTop: 40 }}>Summary Chart</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-30}
            interval={0}
            textAnchor="end"
            height={60}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#007bff" barSize={40} />
        </BarChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: 40 }}>User Age Group Distribution</h2>
      {stats.groupedAgeChartData && stats.groupedAgeChartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={stats.groupedAgeChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="ageGroup"
              angle={-15}
              interval={0}
              textAnchor="end"
              label={{
                value: "Age Group",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, (dataMax) => dataMax + 5]}
              label={{ value: "Users", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#17a2b8"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No age group data available to plot.</p>
      )}
    </div>
  );
}
