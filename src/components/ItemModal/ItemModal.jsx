import { useState, useEffect } from "react";
import { fetchKeywords } from "../../utils/tmdbApi";
import "./ItemModal.css";
import { BUTTONS } from "../../utils/constants";

function ItemModal({ item, isOpen, onClose, onSave, onDeleteRequest }) {
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (!item || !isOpen) {
      setAvailableTags([]);
      setSelectedTags([]);
      return;
    }
    // Use the original TMDB id and mediaType if present, else fallback
    const tmdbId = item.itemId || item.tmdbId || item._id || item.id;
    const mediaType = item.mediaType || item.originalMediaType;
    if (!tmdbId || !mediaType) {
      setAvailableTags([]);
      setSelectedTags(item.tags || []);
      return;
    }
    fetchKeywords(tmdbId, mediaType).then((keywords) => {
      setAvailableTags(keywords.map((k) => k.name));
    });
    setSelectedTags(item.tags || []);
  }, [item, isOpen]);

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    if (!item) return;
    onSave?.({ ...item, tags: selectedTags });
    onClose();
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
        <button
          className="item-modal__close"
          onClick={onClose}
          aria-label={BUTTONS.CLOSE}
        ></button>

        <div className="item-modal__poster-wrapper">
          {item.poster && (
            <img
              src={item.poster.replace("/w92", "/w500")}
              alt={item.title}
              className="item-modal__poster"
            />
          )}
        </div>

        <div className="item-modal__description">
          <p className="item-modal__subtitle">
            {item.mediaType === "movie" ? "Movie" : "TV Show"}
            {item.length ? ` • ${item.length}` : ""}
          </p>

          {item.tags && item.tags.length > 0 && (
            <button
              type="button"
              className="item-modal__delete"
              onClick={() => onDeleteRequest?.(item._id)}
            ></button>
          )}

          <div className="item-modal__tags">
            {availableTags.length === 0 ? (
              <span className="item-modal__no-tags">No tags found.</span>
            ) : (
              availableTags.map((tag) => (
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
            {BUTTONS.SAVE}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
