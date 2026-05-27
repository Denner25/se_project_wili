import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import MoodsContext from "../../contexts/MoodsContext";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { useAutocomplete } from "../../hooks/useAutocomplete";
import "./Autocomplete.css";

function Autocomplete({ onSelect, query, setQuery, token, onlyMedia, lockSelectedValue, selectedItem })
 {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("media");
  const [showFilter, setShowFilter] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const moodsContext = useContext(MoodsContext);
  const allUsersMoods = moodsContext?.allUsersMoods || [];

  const { suggestions, loading, error, handleChange, closeDropdown } =
    useAutocomplete({ query, setQuery, filterType, token });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeDropdown();
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  const selectAndClose = (type) => {
    setFilterType(type);
    setIsClosing(true);
    setTimeout(() => {
      setShowFilter(false);
      setIsClosing(false);
    }, 350);
  };

  const handleSelect = (item) => {
  closeDropdown();
  if (item.mediaType === "user") {
    if (!lockSelectedValue) setQuery("");
    navigate(`/profile/${item.id}`);
    return;
  }

  const itemId = item.id ?? item._id;
  const dbItem = allUsersMoods.find((i) => String(i._id) === String(itemId));
  const resolved = dbItem ?? item;

  onSelect?.(resolved);
  if (lockSelectedValue) {
    setQuery(resolved.title);
  } else {
    setQuery("");
  }
};

  const placeholderMap = {
    media: "Search movies or animes...",
    music: "Search music...",
    book: "Search books...",
    users: "Search users...",
  };

  const placeholder = onlyMedia
    ? "Search movies or animes..."
    : placeholderMap[filterType] ?? "Search...";

  return (
    <div className="autocomplete" ref={containerRef}>
      <div className="autocomplete__input-wrapper">
        <input
          value={query}
          onChange={(e) => {
            if (lockSelectedValue) onSelect?.(null);
            handleChange(e);
          }}
          placeholder={placeholder}
          className={`autocomplete__input${
            lockSelectedValue && selectedItem
              ? " autocomplete__input--selected"
              : ""
          }`}
        />

        {!onlyMedia && (
          <>
            <button
              type="button"
              className="autocomplete__filter-button"
              onClick={() => setShowFilter((p) => !p)}
            >
              ⚙
            </button>

            {showFilter && (
              <div
                className={`autocomplete__filter-dropdown${
                  isClosing ? " autocomplete__filter-dropdown--closing" : ""
                }`}
              >
                {[
                  { value: "media", label: "Movies & Anime" },
                  { value: "music", label: "Music" },
                  { value: "book", label: "Books" },
                  { value: "users", label: "Users" },
                ].map(({ value, label }) => (
                  <label key={value}>
                    <input
                      type="radio"
                      checked={filterType === value}
                      onChange={() => selectAndClose(value)}
                      className="autocomplete__radio-input"
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {error && <div className="autocomplete__error">{error}</div>}
      <Dropdown items={suggestions} onItemClick={handleSelect} />
      {loading && <div className="loading-text">Loading…</div>}
    </div>
  );
}

export default Autocomplete;