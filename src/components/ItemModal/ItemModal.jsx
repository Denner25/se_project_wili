import { useState, useEffect } from "react";
import { fetchKeywords } from "../../utils/tmdbApi";
import "./ItemModal.css";
import { BUTTONS } from "../../utils/constants";
import MoodsCloud from "../MoodsCloud/MoodsCloud";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import useModalClose from "../../hooks/useModalClose";

function ItemModal({
  item,
  isOpen,
  onClose,
  onSave,
  onDeleteRequest,
  isLoggedIn,
  onSignUpClick,
}) {
  const currentUser = useContext(CurrentUserContext);
  const [userMoods, setUserMoods] = useState([]);
  const [allUsersMoods, setAllUsersMoods] = useState([]);
  const [availableMoods, setAvailableMoods] = useState([]);
  const [activeTab, setActiveTab] = useState("available"); // "available" | "allUsers"

  // This state keeps the item mounted for transitions
  const [currentItem, setCurrentItem] = useState(item);

  useModalClose(isOpen, onClose);

  // Update currentItem when modal opens
  useEffect(() => {
    if (isOpen && item) {
      setCurrentItem(item);
    }
  }, [isOpen, item]);

  useEffect(() => {
    if (!currentItem || !isOpen) {
      setUserMoods([]);
      setAllUsersMoods([]);
      setAvailableMoods([]);
      return;
    }

    const _id = currentItem._id || currentItem.id;
    const mediaType = currentItem.mediaType || currentItem.originalMediaType;

    // Fetch external keywords if available
    if (_id && mediaType) {
      fetchKeywords(_id, mediaType).then((keywords) => {
        setAvailableMoods(keywords.map((k) => k.name));
      });
    } else {
      setAvailableMoods([]);
    }

    // Set current user's moods
    setUserMoods(
      currentItem.moods
        ?.filter((m) => m.users.includes(currentUser?._id))
        .map((m) => m.name) || []
    );

    // Set all users' moods (read-only for display)
    setAllUsersMoods(
      currentItem.moods?.flatMap((m) => Array(m.users.length).fill(m.name)) ||
        []
    );
  }, [currentItem, isOpen, currentUser]);

  // Toggle user's mood selection
  const handleMoodChange = (moodName) => {
    setUserMoods((prev) =>
      prev.includes(moodName)
        ? prev.filter((m) => m !== moodName)
        : [...prev, moodName]
    );
  };

  // Save updated moods for current user
  const handleSave = () => {
    if (!currentItem) return;

    const updatedMoods = (currentItem.moods || []).map((m) => ({ ...m }));

    updatedMoods.forEach((m) => {
      m.users = m.users.filter((u) => u !== currentUser._id);
    });

    userMoods.forEach((moodName) => {
      const existingMood = updatedMoods.find((m) => m.name === moodName);
      if (existingMood) {
        if (!existingMood.users.includes(currentUser._id)) {
          existingMood.users.push(currentUser._id);
        }
      } else {
        updatedMoods.push({ name: moodName, users: [currentUser._id] });
      }
    });

    const filteredMoods = updatedMoods.filter((m) => m.users.length > 0);

    onSave?.({ ...currentItem, moods: filteredMoods });
    onClose();
  };

  // If there's no currentItem, render empty modal container for transition
  if (!currentItem) {
    return (
      <div
        className={`item-modal${isOpen ? " item-modal_open" : ""}`}
        onClick={onClose}
      >
        <div
          className="item-modal__content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* empty content */}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`item-modal${isOpen ? " item-modal_open" : ""}`}
      onClick={onClose}
    >
      <div className="item-modal__content" onClick={(e) => e.stopPropagation()}>
        <button
          className="item-modal__close"
          onClick={onClose}
          aria-label={BUTTONS.CLOSE}
        />

        <div className="item-modal__poster-wrapper">
          {currentItem.poster && (
            <img
              src={currentItem.poster.replace("/w92", "/w500")}
              alt={currentItem.title}
              className="item-modal__poster"
            />
          )}
        </div>

        <div className="item-modal__description">
          <p className="item-modal__subtitle">
            {currentItem.mediaType === "movie" ? "Movie" : "TV Show"}
            {currentItem.length ? ` • ${currentItem.length}` : ""}
          </p>

          {isLoggedIn &&
            currentItem.moods &&
            currentItem.moods.some((m) =>
              m.users.includes(currentUser?._id)
            ) && (
              <button
                type="button"
                className="item-modal__delete"
                onClick={() => onDeleteRequest?.(currentItem._id)}
              />
            )}

          {/* Tabs */}
          <div className="item-modal__tabs">
            <button
              className={`item-modal__tab ${
                activeTab === "available" ? "active" : ""
              }`}
              onClick={() => setActiveTab("available")}
            >
              Available Moods
            </button>
            <button
              className={`item-modal__tab ${
                activeTab === "allUsers" ? "active" : ""
              }`}
              onClick={() => setActiveTab("allUsers")}
            >
              All Users' Moods
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "available" && (
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
          )}

          {activeTab === "allUsers" && (
            <div className="item-modal__cloud">
              <MoodsCloud moods={allUsersMoods} />
            </div>
          )}

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
