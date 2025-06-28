import { useState } from "react";
import OtpInput from "../components/OtpInput";
import { loginUser, verifyLoginOTP } from "../api/userAPI";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(""); // Track user role

  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email address");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser(email, password); // backend call

      // Admin login returns token & user
      if (res.token && res.user) {
        
        // Save token and user info
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        console.log('Login token:', res.token); 
         alert(`Welcome, ${res.user.username || res.user.name || res.user.email}!`);
        if (res.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          // Just in case, if a voter gets token here (unlikely)
          setRole(res.user.role);
          setStep(2);
        }
      } else if (res.message && res.message.includes("OTP sent")) {
        // Voter login response, OTP sent message
        setRole("voter");
        setStep(2);
      } else {
        alert("Unexpected login response");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otpValue) => {
    if (!otpValue || otpValue.length !== 6) {
      alert("Enter a 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const data = await verifyLoginOTP(email, otpValue);

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
         alert(`Welcome, ${data.user.username || data.user.name || data.user.email}!`);
        navigate("/home");
      } else {
        alert("Invalid OTP verification response");
      }
    } catch (error) {
      alert(error.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step === 1 && (
        <form onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      )}

      {step === 2 && role === "voter" && (
        <div>
          <p>Enter OTP sent to <b>{email}</b></p>
          <OtpInput length={6} onOtpSubmit={handleOtpSubmit} />
          {loading && <p>Verifying OTP...</p>}
        </div>
      )}

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
