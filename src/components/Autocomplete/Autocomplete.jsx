import { useState, useRef, useEffect } from "react";
import { searchMulti, getDetails } from "../../utils/tmdbApi";
import { getUsers } from "../../utils/Api"; // Updated import
import Dropdown from "../Dropdown/Dropdown";
import { IMAGE_BASE_URL_W92, ERROR_MESSAGES } from "../../utils/constants";
import "./Autocomplete.css";

const detailCache = {};

function Autocomplete({ onSelect, query, setQuery, token }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Filter state
  const [filterType, setFilterType] = useState("media"); // media/users
  const [showFilter, setShowFilter] = useState(false);

  const debounceRef = useRef(null);
  const containerRef = useRef(null); // click-out detection

  const closeDropdown = () => setSuggestions([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeDropdown();
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function formatTitle(item) {
    const rawTitle =
      item.media_type === "movie"
        ? item.title || item.original_title
        : item.name || item.original_name;

    const rawDate =
      item.media_type === "movie" ? item.release_date : item.first_air_date;

    const year = rawDate ? rawDate.slice(0, 4) : null;
    return year ? `${rawTitle} (${year})` : rawTitle;
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 600); // debounce
  };

  const fetchSuggestions = (text) => {
    if (!text.trim()) {
      setSuggestions([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    if (filterType === "users") {
      getUsers(text, token) // Token can be null
        .then((users) => {
          setSuggestions(
            users.slice(0, 5).map((u) => ({
              id: u._id,
              title: u.name,
              avatar: u.avatarUrl,
              mediaType: "user",
              length: null,
            }))
          );
        })
        .catch(() => setError(ERROR_MESSAGES.FETCH_SUGGESTIONS_FAILED))
        .finally(() => setLoading(false));
      return;
    }

    // TMDB logic remains unchanged
    const yearMatch = text.match(/(\d{4})$/);
    const year = yearMatch ? yearMatch[1] : null;
    const titleQuery = year ? text.replace(/\d{4}$/, "").trim() : text;

    searchMulti(titleQuery)
      .then((data) => {
        let results = data.results || [];

        if (year) {
          results = results.filter((item) => {
            const releaseDate =
              item.media_type === "movie"
                ? item.release_date
                : item.first_air_date;
            return releaseDate?.startsWith(year);
          });
        }

        const baseResults = results
          .filter(
            (item) =>
              (item.media_type === "movie" || item.media_type === "tv") &&
              (item.title || item.name)
          )
          .slice(0, 5)
          .map((item) => ({
            id: item.id,
            mediaType: item.media_type,
            title: formatTitle(item),
            poster: item.poster_path
              ? `${IMAGE_BASE_URL_W92}${item.poster_path}`
              : null,
            length: null,
          }));

        setSuggestions(baseResults);

        baseResults.forEach((item, index) => {
          const cacheKey = `${item.mediaType}-${item.id}`;
          if (detailCache[cacheKey]) {
            setSuggestions((prev) =>
              prev.map((s, idx) =>
                idx === index ? { ...s, length: detailCache[cacheKey] } : s
              )
            );
            return;
          }

          getDetails(item.id, item.mediaType)
            .then((detail) => {
              let lengthInfo = null;
              if (item.mediaType === "movie") {
                lengthInfo = detail.runtime ? `${detail.runtime} min` : null;
              } else {
                const episodes = detail.number_of_episodes;
                const runtime = detail.episode_run_time?.[0];
                if (episodes && runtime)
                  lengthInfo = `${episodes} ep • ${runtime} min`;
                else if (episodes) lengthInfo = `${episodes} episodes`;
              }

              detailCache[cacheKey] = lengthInfo;

              setSuggestions((prev) =>
                prev.map((s, idx) =>
                  idx === index ? { ...s, length: lengthInfo } : s
                )
              );
            })
            .catch(() => setError(ERROR_MESSAGES.FETCH_DETAILS_FAILED));
        });
      })
      .catch(() => setError(ERROR_MESSAGES.FETCH_SUGGESTIONS_FAILED))
      .finally(() => setLoading(false));
  };

  const handleSelect = (item) => {
    onSelect?.(item);
    setSuggestions([]);
    setQuery("");
  };

  return (
    <div className="autocomplete" ref={containerRef}>
      <div className="autocomplete__input-wrapper">
        <input
          value={query}
          onChange={handleChange}
          placeholder="Search movies and animes..."
          className="autocomplete__input"
        />
        <button
          type="button"
          className="autocomplete__filter-button"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          ⚙
        </button>
        {showFilter && (
          <div className="autocomplete__filter-dropdown">
            <label>
              <input
                type="radio"
                value="media"
                checked={filterType === "media"}
                onChange={() => setFilterType("media")}
              />
              Media
            </label>
            <label>
              <input
                type="radio"
                value="users"
                checked={filterType === "users"}
                onChange={() => setFilterType("users")}
              />
              Users
            </label>
          </div>
        )}
      </div>

      {error && <div className="autocomplete__error">{error}</div>}
      <Dropdown items={suggestions} onItemClick={handleSelect} />
      {loading && <div className="loading-text">Loading…</div>}
    </div>
  );
}

export default Autocomplete;
