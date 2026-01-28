// src/components/FavoriteModal.jsx
import React, { useState } from "react";
import { supabase } from "../../services/supabaseClient"; // Adjust path as needed
import "../Desktop_view/Desktop_css/FavoriteModal.css";

const FavoriteModal = ({ isOpen, onClose, businessName, mobile }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const options = ["My Buyers", "My Sellers", "Family & Friends", "My List"];

  const handleSaveFavorite = async () => {
    if (!selectedOption) return;

    setIsLoading(true);

    try {
      // Get current user ID from localStorage (or your auth system)
      const userId = localStorage.getItem("userId");

      if (!userId) {
        alert("Please log in first!");
        return;
      }

      // Check if group already exists
      let { data: existingGroups, error: groupError } = await supabase
        .from("favorites_groups")
        .select("id")
        .eq("group_name", selectedOption)
        .eq("user_id", userId);

      let groupId;

      if (existingGroups?.length > 0) {
        groupId = existingGroups[0].id;
      } else {
        // Create new group
        const { data: inserted, error: insertError } = await supabase
          .from("favorites_groups")
          .insert({ group_name: selectedOption, user_id: userId })
          .select()
          .single();

        if (insertError) throw insertError;
        groupId = inserted.id;
      }

      // Check if member already exists in this group
      const { data: existingMember } = await supabase
        .from("group_members")
        .select("*")
        .eq("group_id", groupId)
        .eq("mobile_number", mobile);

      if (existingMember?.length > 0) {
        alert(`${businessName} is already in ${selectedOption}`);
        return;
      }

      // Add member to group
      const { error: memberError } = await supabase.from("group_members").insert({
        group_id: groupId,
        member_name: businessName,
        mobile_number: mobile,
      });

      if (memberError) throw memberError;

      alert(`${businessName} saved to ${selectedOption}`);
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Error saving favorite:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="favorite-modal-overlay" onClick={onClose}>
      <div className="favorite-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>

        <h3>Save {businessName} to Group</h3>

        <div className="options-list">
          {options.map((option) => (
            <label key={option} className="radio-option">
              <input
                type="radio"
                name="favorite-group"
                value={option}
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={() => {
              setSelectedOption(null);
              onClose();
            }}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button
            className="btn-confirm"
            onClick={handleSaveFavorite}
            disabled={isLoading || !selectedOption}
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteModal;