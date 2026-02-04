import React, { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import "../Desktop_view/Desktop_css/FavoriteModal.css";

const FavoriteModal = ({ show, onClose, selectedItem }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!show || !selectedItem) return null;

  const businessName = selectedItem.business_name || selectedItem.person_name;
  const mobile = selectedItem.mobile_number;

  const options = [
    { id: "My Buyers", label: "My Buyers", icon: "👤" },
    { id: "My Sellers", label: "My Sellers", icon: "🏠" },
    { id: "Family & Friends", label: "Family & Friends", icon: "❤️" },
    { id: "My List", label: "My List", icon: "📋" },
  ];

  const handleSave = async () => {
    if (!selectedOption) return;
    setIsLoading(true);
    const userId = localStorage.getItem("userId");

    try {
      let { data: groups } = await supabase
        .from("favorites_groups")
        .select("id")
        .eq("group_name", selectedOption)
        .eq("user_id", userId);

      let groupId;
      if (groups?.length > 0) {
        groupId = groups[0].id;
      } else {
        const { data: newGroup } = await supabase
          .from("favorites_groups")
          .insert({ group_name: selectedOption, user_id: userId })
          .select()
          .single();
        groupId = newGroup.id;
      }

      await supabase.from("group_members").insert({
        group_id: groupId,
        member_name: businessName,
        mobile_number: mobile,
      });

      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="favorite-modal-overlay" onClick={onClose}>
      <div className="favorite-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-brand-header">
          <div className="brand-left">
            <div className="brand-logo-box">🛍️</div>
            <span>Favorites</span>
          </div>
          <button className="modal-close-x" onClick={onClose}>×</button>
        </div>

        <div className="modal-content-blue">
          <div className="top-accent-bar"></div>
          <h2>Save {businessName}</h2>
          <p className="subtitle">Choose a group to categorize this contact</p>

          <div className="options-grid">
            {options.map((o) => (
              <div 
                key={o.id} 
                className={`grid-item ${selectedOption === o.id ? 'selected' : ''}`}
                onClick={() => setSelectedOption(o.id)}
              >
                <span className="item-icon">{o.icon}</span>
                <span className="item-label">{o.label}</span>
                <div className="selection-indicator">
                  {selectedOption === o.id && "✓"}
                </div>
              </div>
            ))}
          </div>

          <button 
            className="save-submit-btn" 
            disabled={!selectedOption || isLoading} 
            onClick={handleSave}
          >
            {isLoading ? "Saving..." : "Save Contact →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteModal;