import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axios.post(`${API_BASE}/inquires`, formData);
      setSuccessMessage("Your message has been sent successfully.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
      setErrorMessage("Failed to send message. Please try again.");
    }
  };

  const handleViewFeedback = () => {
    navigate("/feedback"); // Navigate to all feedback page (no email needed)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Contact Us</h2>

        {successMessage && (
          <div className="text-green-600 text-center mb-4 font-medium">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4 font-medium">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="flex-1 h-12 text-base px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="flex-1 h-12 text-base px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <textarea
            name="message"
            placeholder="Type your message here..."
            className="w-full h-48 text-base px-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button
            type="submit"
            className="w-full h-12 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            Send Message
          </button>
        </form>

        {/* Feedback navigation button */}
        <div className="flex justify-end mt-4">
<<<<<<< HEAD
         <button
  onClick={handleViewFeedback}
  style={{
    marginTop: '1rem',
    padding: '8px 16px',
    backgroundColor: '#6c757d', // Gray color
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '14px',
  }}
>
  View All Feedback
</button>

        </div>
         <div style={{ height: "3rem" }}></div>
=======
          <button
            onClick={handleViewFeedback}
            className="text-blue-600 font-semibold hover:underline"
          >
            View All Feedback
          </button>
        </div>
>>>>>>> 85e5ef3cb1d1526f9277237b44e4d31e70cbc94b
      </div>
    </div>
  );
};

export default ContactUs;
