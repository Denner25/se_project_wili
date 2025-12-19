import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown/Dropdown";
import { useAutocomplete } from "../../hooks/useAutocomplete";
import "./Autocomplete.css";

function Autocomplete({
  onSelect,
  query,
  setQuery,
  token,
  onlyMedia = false, // single Boolean prop controlling both placeholder and filter
}) {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("media");
  const [showFilter, setShowFilter] = useState(false);

  const { suggestions, loading, error, handleChange, closeDropdown } =
    useAutocomplete({
      query,
      setQuery,
      filterType,
      token,
    });

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

  const handleSelect = (item) => {
    if (item.mediaType === "user") {
      navigate(`/profile/${item.id}`);
    } else {
      onSelect?.(item);
    }
    setQuery("");
    closeDropdown();
  };

  return (
    <div className="autocomplete" ref={containerRef}>
      <div className="autocomplete__input-wrapper">
        <input
          value={query}
          onChange={handleChange}
          placeholder={
            onlyMedia
              ? "Search movies or animes..."
              : "Search movies, animes, or users..."
          }
          className="autocomplete__input"
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
              <div className="autocomplete__filter-dropdown">
                <label>
                  <input
                    type="radio"
                    checked={filterType === "media"}
                    onChange={() => setFilterType("media")}
                    className="autocomplete__radio-input"
                  />
                  Media
                </label>
                <label>
                  <input
                    type="radio"
                    checked={filterType === "users"}
                    onChange={() => setFilterType("users")}
                    className="autocomplete__radio-input"
                  />
                  Users
                </label>
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
