import { BASE_URL, ERROR_MESSAGES } from "./constants";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

// ✅ Reusable fetch helper with error logging
function fetchWithCatch(url, fallbackValue, errorMessage) {
  return fetch(url)
    .then((res) =>
      res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
    )
    .catch((err) => {
      console.error(errorMessage, err);
      return fallbackValue ?? Promise.reject(err);
    });
}

// 🔹 Search multi with optional year
function searchMulti(query, year = null) {
  let url = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
    query
  )}`;

  // TMDB supports filtering by year for movies and first_air_date_year for TV
  if (year) {
    url += `&year=${year}&first_air_date_year=${year}`;
  }

  return fetchWithCatch(
    url,
    { results: [] },
    ERROR_MESSAGES.FETCH_SEARCH_FAILED
  );
}

// 🔹 Get details for movie or TV show
function getDetails(id, mediaType) {
  const endpoint =
    mediaType === "tv"
      ? `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`
      : `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`;

  return fetchWithCatch(endpoint, null, ERROR_MESSAGES.FETCH_DETAIL_FAILED);
}

// 🔹 Fetch keywords for movie or TV show
function fetchKeywords(id, mediaType) {
  const endpoint =
    mediaType === "movie"
      ? `${BASE_URL}/movie/${id}/keywords?api_key=${API_KEY}`
      : `${BASE_URL}/tv/${id}/keywords?api_key=${API_KEY}`;

  return fetchWithCatch(
    endpoint,
    { keywords: [] },
    ERROR_MESSAGES.FETCH_KEYWORDS_FAILED
  ).then((data) => data.keywords || data.results || []);
}

export { searchMulti, getDetails, fetchKeywords };
