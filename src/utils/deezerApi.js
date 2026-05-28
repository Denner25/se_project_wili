const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.wili.nya.pub"
    : "http://localhost:3001";

function searchArtists(query) {
  return fetch(
    `${BASE_URL}/deezer-search?q=${encodeURIComponent(query)}`
  ).then((res) => res.json());
}

export { searchArtists };