import { useState, useRef } from "react";
import { searchMulti, getDetails } from "../utils/tmdbApi";
import { getUsers } from "../utils/Api";
import { IMAGE_BASE_URL_W92, ERROR_MESSAGES } from "../utils/constants";

const detailCache = {};

export function useAutocomplete({ query, setQuery, filterType, token }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const closeDropdown = () => setSuggestions([]);

  const formatTitle = (item) => {
    const rawTitle =
      item.media_type === "movie"
        ? item.title || item.original_title
        : item.name || item.original_name;

    const rawDate =
      item.media_type === "movie" ? item.release_date : item.first_air_date;

    const year = rawDate ? rawDate.slice(0, 4) : null;
    return year ? `${rawTitle} (${year})` : rawTitle;
  };

  const fetchSuggestions = async (text) => {
    if (!text.trim()) {
      setSuggestions([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 👤 USER SEARCH
      if (filterType === "users") {
        const users = await getUsers(text, token);
        setSuggestions(
          users.slice(0, 5).map((u) => ({
            id: u._id,
            title: u.name,
            avatar: u.avatarUrl,
            mediaType: "user",
          }))
        );
        return;
      }

      // 🎬 MEDIA SEARCH (TMDB)
      const yearMatch = text.match(/(\d{4})$/);
      const year = yearMatch ? yearMatch[1] : null;
      const titleQuery = year ? text.replace(/\d{4}$/, "").trim() : text;

      const data = await searchMulti(titleQuery);
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

      baseResults.forEach(async (item, index) => {
        const cacheKey = `${item.mediaType}-${item.id}`;
        if (detailCache[cacheKey]) {
          setSuggestions((prev) =>
            prev.map((s, i) =>
              i === index ? { ...s, length: detailCache[cacheKey] } : s
            )
          );
          return;
        }

        const detail = await getDetails(item.id, item.mediaType);
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
          prev.map((s, i) => (i === index ? { ...s, length: lengthInfo } : s))
        );
      });
    } catch {
      setError(ERROR_MESSAGES.FETCH_SUGGESTIONS_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 600);
  };

  return {
    suggestions,
    loading,
    error,
    handleChange,
    closeDropdown,
  };
}
