import { searchMulti, getDetails, fetchKeywords } from "./tmdbApi";
import { fetchArtistTags } from "./lastfmApi";
import { searchArtists } from "./deezerApi";
import { searchBooks, fetchBookSubjects } from "./openlibraryApi";
import { searchGames, fetchGameTags } from "./rawgApi";

function fetchMoodKeywords(item) {
  const mediaType = item.mediaType || item.originalMediaType;

  if (mediaType === "music") {
    return fetchArtistTags(item.title);
  }

  if (mediaType === "book") {
    const id = item._id || item.id;

    if (!id) return Promise.resolve([]);

    return fetchBookSubjects(id);
  }

  if (mediaType === "game") {
    const id = item._id || item.id;

    if (!id) return Promise.resolve([]);

    return fetchGameTags(id);
  }

  return fetchKeywords(item._id || item.id, mediaType);
}

export {
  searchMulti,
  getDetails,
  searchArtists,
  searchBooks,
  searchGames,
  fetchMoodKeywords,
};