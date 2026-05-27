const BASE_URL = "http://localhost:3001";

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

function searchArtists(query) {
  return fetch(
    `${BASE_URL}/deezer-search?q=${encodeURIComponent(query)}`
  ).then((res) => res.json());
}

export { searchArtists };