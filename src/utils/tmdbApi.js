const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function checkResponse(res) {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
}

function searchMulti(query) {
  return fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
      query
    )}`
  ).then(checkResponse);
}

function getDetails(id, mediaType) {
  const endpoint =
    mediaType === "tv"
      ? `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`
      : `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`;

  return fetch(endpoint).then(checkResponse);
}

function fetchKeywords(id, mediaType) {
  const endpoint =
    mediaType === "movie"
      ? `${BASE_URL}/movie/${id}/keywords?api_key=${API_KEY}`
      : `${BASE_URL}/tv/${id}/keywords?api_key=${API_KEY}`;
  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      return data.keywords || data.results || [];
    });
}

export { searchMulti, getDetails, checkResponse, fetchKeywords };
