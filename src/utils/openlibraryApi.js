const BASE_URL = "https://openlibrary.org";

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

function searchBooks(query) {
  const url = `${BASE_URL}/search.json?q=${encodeURIComponent(
    query
  )}&limit=5&fields=key,title,author_name,first_publish_year,cover_i,number_of_pages_median`;
  return fetchWithCatch(url, { docs: [] }, "Open Library search failed");
}

const SUBJECT_BLOCKLIST = /^(nyt:|lc:|dewey:|bisac:|overdrive:|rbms:|fast \(|ocolc|accessible book|protected daisy|internet archive)/i;

function fetchBookSubjects(workId) {
  const url = `${BASE_URL}/works/${workId}.json`;
  return fetchWithCatch(url, { subjects: [] }, "Open Library subjects failed")
    .then((data) =>
      (data.subjects || [])
        .map((s) => (typeof s === "string" ? s : s.name))
        .filter((s) => s && !SUBJECT_BLOCKLIST.test(s) && s.length <= 50)
        .slice(0, 20)
        .map((name) => ({ name }))
    );
}

export { searchBooks, fetchBookSubjects };