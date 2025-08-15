import { useState, useEffect } from "react";
import { fetchKeywords } from "../../utils/tmdbApi";
import "./ItemModal.css";
import { BUTTONS } from "../../utils/constants";

function ItemModal({
  item,
  isOpen,
  onClose,
  onSave,
  onDeleteRequest,
  isLoggedIn,
  onSignUpClick,
  currentUser,
}) {
  const [availableMoods, setAvailableMoods] = useState([]);
  const [userMoods, setUserMoods] = useState([]); // moods selected by current user

  useEffect(() => {
    if (!item || !isOpen) {
      setAvailableMoods([]);
      setUserMoods([]);
      return;
    }

    const _id = item._id || item.id;
    const mediaType = item.mediaType || item.originalMediaType;

    if (!_id || !mediaType) {
      setAvailableMoods([]);
      setUserMoods(
        item.moods
          ?.filter((m) => m.users.includes(currentUser?._id))
          .map((m) => m.name) || []
      );
      return;
    }

    fetchKeywords(_id, mediaType).then((keywords) => {
      setAvailableMoods(keywords.map((k) => k.name));
    });

    // Initialize userMoods from current user's selections
    setUserMoods(
      item.moods
        ?.filter((m) => m.users.includes(currentUser?._id))
        .map((m) => m.name) || []
    );
  }, [item, isOpen, currentUser]);

  const handleMoodChange = (moodName) => {
    setUserMoods((prev) =>
      prev.includes(moodName)
        ? prev.filter((m) => m !== moodName)
        : [...prev, moodName]
    );
  };

  const handleSave = () => {
    if (!item) return;

    // Merge user selection into item.moods
    const newMoods = [...(item.moods || [])];

    availableMoods.forEach((mood) => {
      const moodIndex = newMoods.findIndex((m) => m.name === mood);

      if (userMoods.includes(mood)) {
        // Add current user to mood.users if not present
        if (moodIndex >= 0) {
          if (!newMoods[moodIndex].users.includes(currentUser._id)) {
            newMoods[moodIndex].users.push(currentUser._id);
          }
        } else {
          newMoods.push({ name: mood, users: [currentUser._id] });
        }
      } else {
        // Remove current user from mood.users
        if (moodIndex >= 0) {
          newMoods[moodIndex].users = newMoods[moodIndex].users.filter(
            (u) => u !== currentUser._id
          );
        }
      }
    });

    // Check if item has any moods with at least one user
    const hasSelectedMoods = newMoods.some((m) => m.users.length > 0);

    if (hasSelectedMoods) {
      onSave?.({ ...item, moods: newMoods });
    } else {
      onSave?.({ ...item, moods: [] }); // or handle deletion elsewhere
    }

    onClose();
  };

  if (!item) return null;

  return (
    <div
      className={`item-modal-overlay ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div className="item-modal" onClick={(e) => e.stopPropagation()}>
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

          {isLoggedIn && item.moods && item.moods.length > 0 && (
            <button
              type="button"
              className="item-modal__delete"
              onClick={() => onDeleteRequest?.(item._id)}
            ></button>
          )}

          <div className="item-modal__tags">
            {availableMoods.length === 0 ? (
              <span className="item-modal__no-tags">No moods found.</span>
            ) : (
              availableMoods.map((mood) => (
                <label
                  key={mood}
                  className={`item-modal__tag${
                    isLoggedIn && userMoods.includes(mood) ? " selected" : ""
                  }${!isLoggedIn ? " disabled" : ""}`}
                  onClick={
                    isLoggedIn ? () => handleMoodChange(mood) : undefined
                  }
                >
                  {mood}
                </label>
              ))
            )}
          </div>

          {isLoggedIn ? (
            <button
              type="button"
              className="item-modal__button"
              onClick={handleSave}
            >
              {BUTTONS.SAVE}
            </button>
          ) : (
            <div className="item-modal__button" onClick={onSignUpClick}>
              Sign up to mark your top moods!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemModal;
