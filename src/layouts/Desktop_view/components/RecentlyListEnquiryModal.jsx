import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../components/css/RecentlyListEnquiryModal.css";

import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const RecentlyListEnquiryModal = ({ show, onClose, selectedBusiness }) => {
  const { userData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  /* 🔹 Extract selected profile name */
  const targetName =
    selectedBusiness?.business_name ||
    selectedBusiness?.person_name ||
    "this profile";

  /* 🔹 Prefill user data if logged in */
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.person_name || userData.business_name || "",
        phone: userData.mobile_number || "",
        message: "",
      });
    }
  }, [userData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    onClose();

    MySwal.fire({
      title: "Enquiry Sent",
      text: `Your enquiry has been sent to ${targetName}`,
      icon: "success",
      timer: 2200,
      showConfirmButton: false,
    });
  };

  if (!show) return null;

  return (
    <div className="enquire-modal-backdrop" onClick={onClose}>
      <div
        className="enquire-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        {/* ================= MAIN CONTENT ================= */}
        <div className="modal-inner">
          {/* ========= LEFT SIDE ========= */}
          <div className="left-side">
            <div className="promo-content">
              <img
                src="https://via.placeholder.com/150x150.png?text=Promo+Image"
                alt="promo"
              />
              <p className="fw-bold mb-1">Connect with</p>
              <h5 className="text-primary fw-bold mb-2">20k+ People</h5>
              <p className="small text-muted mb-4">on Signpost</p>
              <button
                className="btn btn-primary rounded-pill px-4 py-2"
                onClick={() => navigate("/PostYourListing")}
              >
                List your business for <b>FREE</b>
              </button>
            </div>
          </div>

          {/* ========= RIGHT SIDE ========= */}
          <div className="right-side">
            <h4 className="fw-bold mb-1">
              Send enquiry to{" "}
              <span className="text-primary">{targetName}</span>
            </h4>

            <p className="small text-muted mb-4">
              We will share your requirement directly with this profile
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                className="form-control mb-3"
                placeholder="Your Name *"
                value={formData.name}
                onChange={handleChange}
                disabled={!!userData}
              />

              <input
                type="tel"
                name="phone"
                className="form-control mb-3"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                disabled={!!userData}
              />

              <textarea
                name="message"
                className="form-control mb-4"
                placeholder="Your Message *"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
              />

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary px-5">
                  📩 Send Enquiry
                </button>
              </div>
            </form>

            <ul className="info-list">
              <li>Your requirement is sent to selected relevant businesses</li>
              <li>Businesses compete to get you the best deal</li>
              <li>You choose whichever suits you best</li>
              <li>Contact info sent to you via SMS/WhatsApp</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyListEnquiryModal;
