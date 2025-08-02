import { useState, useRef } from "react";
import { searchMulti, getDetails } from "../../utils/tmdbApi";
import Dropdown from "../Dropdown/Dropdown";
import "./Autocomplete.css";

const detailCache = {};

export default function Autocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // 🔹 Format title with year
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

  // 🔹 On input change, trigger debounce
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 600); // 0.6s debounce
  };

  // 🔹 Fetch suggestions from TMDB (using .then)
  const fetchSuggestions = (text) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    searchMulti(text)
      .then((data) => {
        const baseResults = (data.results || [])
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
              ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
              : null,
            length: null,
          }));

        setSuggestions(baseResults);

        // Sequentially fetch details to get runtime/episodes
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
            .catch((err) => console.error("Detail fetch error:", err));
        });
      })
      .catch((err) => console.error("Search error:", err))
      .finally(() => setLoading(false));
  };

  // 🔹 Handle selection
  const handleSelect = (item) => {
    // Forward to App to open modal
    onSelect?.(item);

    // Optional: close dropdown and fill input
    setSuggestions([]);
    setQuery(item.title);
  };

  return (
    <div className="autocomplete">
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search movies or shows..."
        className="autocomplete__input"
      />
      <Dropdown items={suggestions} onItemClick={handleSelect} />
      {loading && <div className="loading-text">Loading…</div>}
    </div>
  );
}
