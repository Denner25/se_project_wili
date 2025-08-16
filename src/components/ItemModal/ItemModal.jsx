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
  const [itemUserMoods, setItemUserMoods] = useState([]); // current user's moods for this item

  useEffect(() => {
    if (!item || !isOpen) {
      setAvailableMoods([]);
      setItemUserMoods([]);
      return;
    }

    const _id = item._id || item.id;
    const mediaType = item.mediaType || item.originalMediaType;

    if (!_id || !mediaType) {
      setAvailableMoods([]);
      setItemUserMoods(
        item.moods
          ?.filter((m) => m.users.includes(currentUser?._id))
          .map((m) => m.name) || []
      );
      return;
    }

    fetchKeywords(_id, mediaType).then((keywords) => {
      setAvailableMoods(keywords.map((k) => k.name));
    });

    // Initialize itemUserMoods from current user's selections
    setItemUserMoods(
      item.moods
        ?.filter((m) => m.users.includes(currentUser?._id))
        .map((m) => m.name) || []
    );
  }, [item, isOpen, currentUser]);

  const handleMoodChange = (moodName) => {
    setItemUserMoods((prev) =>
      prev.includes(moodName)
        ? prev.filter((m) => m !== moodName)
        : [...prev, moodName]
    );
  };

  const handleSave = () => {
    if (!item) return;

    const updatedMoods = (item.moods || []).map((m) => ({ ...m }));

    // Remove current user from all moods first
    updatedMoods.forEach((m) => {
      m.users = m.users.filter((u) => u !== currentUser._id);
    });

    // Add current user back to selected moods
    itemUserMoods.forEach((moodName) => {
      const existingMood = updatedMoods.find((m) => m.name === moodName);
      if (existingMood) {
        if (!existingMood.users.includes(currentUser._id)) {
          existingMood.users.push(currentUser._id);
        }
      } else {
        updatedMoods.push({ name: moodName, users: [currentUser._id] });
      }
    });

    // Remove moods with no users
    const filteredMoods = updatedMoods.filter((m) => m.users.length > 0);

    onSave?.({ ...item, moods: filteredMoods });
    onClose();
  };

  /* - Introduced `itemUserMoods` to track current user's moods per item.
    - Updated handleSave and delete handlers to remove only current user's ID from item.moods.
    - Ensured items disappear from user's view only when their last mood is removed.
    - Preserved other users' moods and item integrity. */

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

          {isLoggedIn &&
            item.moods &&
            item.moods.some((m) => m.users.includes(currentUser?._id)) && (
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
                    isLoggedIn && itemUserMoods.includes(mood)
                      ? " selected"
                      : ""
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
