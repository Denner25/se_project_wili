import React, { useState, useEffect } from "react";
import { fetchKeywords } from "../../utils/tmdbApi";
import "./ItemModal.css";

function ItemModal({ item, isOpen, onClose, onSave }) {
  const [moodTags, setMoodTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (!item || !isOpen) return;
    fetchKeywords(item.id, item.mediaType).then((keywords) => {
      setMoodTags(keywords.map((k) => k.name));
    });
    setSelectedTags(item.moods || []);
  }, [item, isOpen]);

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    onSave?.({ ...item, moods: selectedTags });
    onClose();
    setSelectedTags([]);
  };

  if (!item) return null;

  return (
    <div
      className={`item-modal-overlay ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div
        className="item-modal"
        onClick={(e) => e.stopPropagation()} // prevent closing on modal click
      >
        {/* Close button inside modal but visually outside */}
        <button
          className="item-modal__close"
          onClick={onClose}
          aria-label="Close modal"
        />

        {/* Poster on the left */}
        <div className="item-modal__poster-wrapper">
          {item.poster && (
            <img
              src={item.poster.replace("/w92", "/w500")}
              alt={item.title}
              className="item-modal__poster"
            />
          )}
        </div>

        {/* Right description */}
        <div className="item-modal__description">
          <p className="item-modal__subtitle">
            {item.mediaType === "movie" ? "Movie" : "TV Show"}
            {item.length ? ` • ${item.length}` : ""}
          </p>

          <div className="item-modal__tags">
            {moodTags.length === 0 ? (
              <span className="item-modal__no-tags">No tags found.</span>
            ) : (
              moodTags.map((tag) => (
                <label
                  key={tag}
                  className={`item-modal__tag ${
                    selectedTags.includes(tag) ? "selected" : ""
                  }`}
                  onClick={() => handleTagChange(tag)}
                >
                  {tag}
                </label>
              ))
            )}
          </div>

          <button
            type="button"
            className="item-modal__save-button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
