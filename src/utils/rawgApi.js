const API_KEY = import.meta.env.VITE_RAWG_KEY;
const BASE_URL = "https://api.rawg.io/api";

function fetchWithCatch(url, fallback, label) {
  return fetch(url)
    .then((res) =>
      res.ok ? res.json() : Promise.reject(`Error: ${res.status}`)
    )
    .catch((err) => {
      console.error(label, err);
      return fallback;
    });
}

function searchGames(query) {
  const url = `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(
    query
  )}&page_size=5`;

  return fetchWithCatch(
    url,
    { results: [] },
    "RAWG search failed"
  );
}

function fetchGameTags(gameId) {
  const url = `${BASE_URL}/games/${gameId}?key=${API_KEY}`;

  return fetchWithCatch(
    url,
    { tags: [] },
    "RAWG tags failed"
  ).then((data) =>
    (data.tags || [])
      .slice(0, 20)
      .map((tag) => ({ name: tag.name }))
  );
}

export { searchGames, fetchGameTags };