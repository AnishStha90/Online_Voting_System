import React, { useState } from "react";
import Footer from "./layout/Footer";
import "../LandingPage.css";

const LandingPage = () => {
  const [features, setFeatures] = useState([
    {
      title: "Secure Authentication",
      description: "Two-factor login using OTP and secure password encryption.",
    },
    {
      title: "Real-time Results",
      description: "Votes are instantly counted and reflected with zero errors.",
    },
    {
      title: "Transparent & Fair",
      description: "Each vote is tracked securely to ensure trust and fairness.",
    },
  ]);

  const [newFeature, setNewFeature] = useState({ title: "", description: "" });

  const handleInputChange = (e) => {
    setNewFeature({ ...newFeature, [e.target.name]: e.target.value });
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (newFeature.title && newFeature.description) {
      setFeatures([...features, newFeature]);
      setNewFeature({ title: "", description: "" });
    }
  };

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Votehub</h1>
          
        </div>
      </header>

      {/* Spacer div */}
<div style={{ height: "3rem" }}></div>


      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-20">
        <div className="px-6">
          <h2 className="text-4xl font-bold mb-4">Empowering Democracy</h2>
          <p className="text-xl mb-6">Your voice matters — vote now, shape the future.</p>
          <a href="/login" className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100">Get Started</a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-100">
  <div className="container mx-auto px-6 text-center">
    <div className="features-content">
      <h3 className="text-3xl font-bold mb-10">System Features</h3>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
       </div>

          {/* Optional Admin Feature Form */}
          {/* 
          <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-4 text-center">Admin: Add New Feature</h4>
            <form onSubmit={handleAddFeature} className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="title"
                placeholder="Feature Title"
                value={newFeature.title}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded"
              />
              <input
                type="text"
                name="description"
                placeholder="Feature Description"
                value={newFeature.description}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded"
              />
              <div className="md:col-span-2 text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Add Feature
                </button>
              </div>
            </form>
          </div>
          */}
        </div>
      </section>

     {/* CTA Section */}
<section className="bg-blue-700 text-white py-12 text-center mb-12">
  <h3 className="text-3xl font-bold mb-4">Ready to Vote?</h3>
  <p className="mb-6">Join millions in making democratic decisions online.</p>
  <a href="/register" className="bg-white text-blue-700 px-6 py-3 rounded font-bold hover:bg-gray-100">Register to Vote</a>
</section>

{/* Spacer div */}
<div style={{ height: "3rem" }}></div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
