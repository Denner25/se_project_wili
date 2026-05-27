import { useState, useEffect, useContext } from "react";
import { fetchMoodKeywords } from "../../utils/mediaApi";
import "./ItemModal.css";
import { BUTTONS, MEDIA_LABELS } from "../../utils/constants";
import MoodsCloud from "../MoodsCloud/MoodsCloud";
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
  const { user: currentUser } = useContext(CurrentUserContext);
  const [userMoods, setUserMoods] = useState([]);
  const [allUsersMoods, setAllUsersMoods] = useState([]);
  const [availableMoods, setAvailableMoods] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [currentItem, setCurrentItem] = useState(item);

  useModalClose(isOpen, onClose);

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

    setUserMoods(
      currentItem.moods
        ?.filter((m) => m.users.includes(currentUser?._id))
        .map((m) => m.name) || []
    );

    setAllUsersMoods(
      currentItem.moods?.flatMap((m) =>
        Array(m.users.length).fill(m.name)
      ) || []
    );

    if (_id && mediaType) {
      let cancelled = false;
      fetchMoodKeywords(currentItem).then((keywords) => {
        if (!cancelled) setAvailableMoods((keywords || []).map((k) => k.name));
      });
      return () => { cancelled = true; };
    } else {
      setAvailableMoods([]);
    }
  }, [currentItem, isOpen, currentUser]);

  const handleMoodChange = (moodName) => {
    setUserMoods((prev) =>
      prev.includes(moodName)
        ? prev.filter((m) => m !== moodName)
        : [...prev, moodName]
    );
  };

  const handleSave = () => {
    if (!currentItem) return;

    const updatedMoods = (currentItem.moods || []).map((m) => ({
      ...m,
      users: [...m.users],
    }));

    updatedMoods.forEach((m) => {
      m.users = m.users.filter((u) => u !== currentUser._id);
    });

    userMoods.forEach((moodName) => {
      const existing = updatedMoods.find((m) => m.name === moodName);
      if (existing) {
        if (!existing.users.includes(currentUser._id)) {
          existing.users.push(currentUser._id);
        }
      } else {
        updatedMoods.push({ name: moodName, users: [currentUser._id] });
      }
    });

    onSave?.({
      ...currentItem,
      moods: updatedMoods.filter((m) => m.users.length > 0),
    });
    onClose();
  };

  const getPosterSrc = (i) => {
    if (!i?.poster) return null;
    if (i.mediaType === "movie" || i.mediaType === "tv") {
      return i.poster.replace("/w92", "/w500");
    }
    return i.poster;
  };

  if (!currentItem) {
    return (
      <div
        className={`item-modal${isOpen ? " item-modal_open" : ""}`}
        onClick={onClose}
      >
        <div className="item-modal__content" onClick={(e) => e.stopPropagation()} />
      </div>
    );
  }

  const posterSrc = getPosterSrc(currentItem);

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
          {posterSrc && (
            <img
              src={posterSrc}
              alt={currentItem.title}
              className="item-modal__poster"
            />
          )}
        </div>

        <div className="item-modal__description">
          <p className="item-modal__subtitle">
            {MEDIA_LABELS[currentItem.mediaType] ?? currentItem.mediaType}
            {currentItem.length ? ` • ${currentItem.length}` : ""}
            {currentItem.author ? ` • ${currentItem.author}` : ""}
          </p>

          {isLoggedIn &&
            currentItem.moods?.some((m) =>
              m.users.includes(currentUser?._id)
            ) && (
              <button
                type="button"
                className="item-modal__delete"
                onClick={() => onDeleteRequest?.(currentItem._id)}
              />
            )}

          <div className="item-modal__tabs">
            <button
              className={`item-modal__tab${activeTab === "available" ? " active" : ""}`}
              onClick={() => setActiveTab("available")}
            >
              Available Moods
            </button>
            <button
              className={`item-modal__tab${activeTab === "allUsers" ? " active" : ""}`}
              onClick={() => setActiveTab("allUsers")}
            >
              All Users' Moods
            </button>
          </div>

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
                    onClick={isLoggedIn ? () => handleMoodChange(mood) : undefined}
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