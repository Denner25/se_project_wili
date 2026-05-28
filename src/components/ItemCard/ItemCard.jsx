import { useRef, useState, useEffect } from "react";
import "./ItemCard.css";

function ItemCard({
  item,
  onClick,
  onDeleteRequest,
  onPrivacyChange,
  privateItems = [],
  hideDelete,
  allUsersMoods,
}) {
  const cardMoods =
    allUsersMoods?.find((i) => i._id === item._id)?.moods || item.moods || [];

  const showActions = !hideDelete && cardMoods.length > 0;

  // Normalize everything to strings to avoid numeric vs string _id mismatches
  const itemIdStr = String(item._id);
  const privateSet = new Set(
    (Array.isArray(privateItems) ? privateItems : [...privateItems]).map(String)
  );
  const isPrivate = privateSet.has(itemIdStr);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const handlePrivacySelect = (e, value) => {
    e.stopPropagation();
    onPrivacyChange?.(item._id, value === "private");
    setDropdownOpen(false);
  };

  return (
    <div className="item-card" onClick={onClick}>
      <div className="item-card__poster-wrapper">

        {showActions && (
          <div className="item-card__action-tray">

            <div
              className="item-card__privacy-wrapper"
              ref={dropdownRef}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={`item-card__action-btn${isPrivate ? " item-card__action-btn--active" : ""}`}
                aria-label={isPrivate ? "Privacy: private" : "Privacy: public"}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen((prev) => !prev);
                }}
              >
                {isPrivate ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                )}
              </button>

              {dropdownOpen && (
                <div className="item-card__privacy-dropdown">
                  <label className="item-card__privacy-option">
                    <input
                      type="radio"
                      name={`privacy-${item._id}`}
                      value="public"
                      checked={!isPrivate}
                      onChange={(e) => handlePrivacySelect(e, "public")}
                    />
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    Public
                  </label>
                  <label className="item-card__privacy-option">
                    <input
                      type="radio"
                      name={`privacy-${item._id}`}
                      value="private"
                      checked={isPrivate}
                      onChange={(e) => handlePrivacySelect(e, "private")}
                    />
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Private
                  </label>
                </div>
              )}
            </div>

            <button
              type="button"
              className="item-card__action-btn item-card__action-btn--delete"
              aria-label="Delete item"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest?.(item._id);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>

          </div>
        )}

        {isPrivate && (
          <div className="item-card__private-badge" aria-label="Private item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        )}

        {item.poster && (
          <img
            src={item.poster.replace("/w92", "/w342")}
            alt={item.title}
            className="item-card__poster"
          />
        )}
      </div>

      <div className="item-card__info">
        <h4 className="item-card__title">{item.title}</h4>
        <p className="item-card__moods">
          {cardMoods.length > 0
            ? cardMoods.map((m) => m.name).join(", ")
            : "No moods"}
        </p>
      </div>
    </div>
  );
}

export default ItemCard;