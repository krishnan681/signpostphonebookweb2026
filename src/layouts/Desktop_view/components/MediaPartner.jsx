import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdBusiness, MdEmail, MdPhone, MdPerson } from "react-icons/md";
import "../components/css/MediaPatner.css";

const MediaPartner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    businessType: "retail",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Partnership Data:", formData);
    // Logic for next steps goes here
  };

  return (
    <div className="media-partner-wrapper">
      <div className="media-partner-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack /> Back to Search
        </button>

        <div className="form-card">
          <div className="form-header">
            <h2>Join Our Business Network</h2>
            <p>Fill out the details below to list your business as a Media Partner.</p>
          </div>

          <form onSubmit={handleSubmit} className="partner-form">
            <div className="input-row">
              <div className="input-group">
                <label><MdBusiness /> Business Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Creative Solutions Ltd"
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label><MdPerson /> Contact Person</label>
                <input 
                  type="text" 
                  placeholder="Full Name"
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="input-row">
              <div className="input-group">
                <label><MdEmail /> Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label><MdPhone /> Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label>Business Category</label>
              <select onChange={(e) => setFormData({...formData, businessType: e.target.value})}>
                <option value="retail">Retail / Shop</option>
                <option value="service">Service Provider</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="media">Media & Agency</option>
              </select>
            </div>

            <div className="input-group">
              <label>Brief Description</label>
              <textarea 
                placeholder="Tell us about your business services..."
                rows="4"
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button type="submit" className="submit-partner-btn">
              Register Business Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MediaPartner;