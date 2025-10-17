// components/Autocomplete/Autocomplete.jsx
import { useEffect, useRef } from "react";
import Dropdown from "../Dropdown/Dropdown";
import { useAutocomplete } from "../../hooks/useAutocomplete";
import "./Autocomplete.css";

function Autocomplete({ onSelect, query, setQuery }) {
  const containerRef = useRef(null);

  const { suggestions, loading, error, handleChange, closeDropdown } =
    useAutocomplete(query, setQuery);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  const handleSelect = (item) => {
    onSelect?.(item);
    setQuery("");
    closeDropdown();
  };

  return (
    <div className="autocomplete" ref={containerRef}>
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search movies and animes..."
        className="autocomplete__input"
      />
      {error && <div className="autocomplete__error">{error}</div>}
      <Dropdown items={suggestions} onItemClick={handleSelect} />
      {loading && <div className="loading-text">Loading…</div>}
    </div>
  );
}

export default Autocomplete;
