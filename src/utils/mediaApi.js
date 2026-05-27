import { searchMulti, getDetails, fetchKeywords } from "./tmdbApi";
import { fetchArtistTags } from "./lastfmApi";
import { searchArtists } from "./deezerApi";
import { searchBooks, fetchBookSubjects } from "./openlibraryApi";

function fetchMoodKeywords(item) {
  const mediaType = item.mediaType || item.originalMediaType;
  if (mediaType === "music") return fetchArtistTags(item.title);
  if (mediaType === "book") {
    const id = item._id || item.id;
    if (!id) return Promise.resolve([]);
    return fetchBookSubjects(id);
  }
  return fetchKeywords(item._id || item.id, mediaType);
}

export { searchMulti, getDetails, searchArtists, searchBooks, fetchMoodKeywords };