const API_KEY = import.meta.env.VITE_LASTFM_KEY;
const BASE_URL = "https://ws.audioscrobbler.com/2.0";

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

function fetchArtistTags(artist) {
  const url = `${BASE_URL}/?method=artist.gettoptags&artist=${encodeURIComponent(
    artist
  )}&api_key=${API_KEY}&format=json`;
  return fetchWithCatch(
    url,
    { toptags: { tag: [] } },
    "Last.fm artist tags failed"
  ).then((data) =>
    (data.toptags?.tag || [])
      .filter((t) => Number(t.count) > 10)
      .slice(0, 20)
      .map((t) => ({ name: t.name }))
  );
}

export { fetchArtistTags };