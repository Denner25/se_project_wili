import { useMemo, useState } from "react";
import ReactWordcloud from "react-wordcloud";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import MediaFilter from "../MediaFilter/MediaFilter";
import useTargetUser from "../../hooks/useTargetUser";
import PageMotion from "../PageMotion/PageMotion";
import "./TopMoods.css";

const PALETTE = [
  "#26c6da", "#29c331", "#ff7043",
  "#ab47bc", "#fffb26", "#29b6f6", "#ef5350",
];

const CLOUD_OPTIONS = {
  rotations: 0,
  fontFamily: "Poppins, sans-serif",
  fontWeight: "700",
  fontSizes: [18, 70],
  padding: 2,
  deterministic: false,
};

const ALL_TYPES = [
  { value: "movie", label: "Movies & Anime" },
  { value: "music", label: "Music" },
  { value: "book", label: "Books" },
];

function buildWords(moods) {
  const counts = {};
  moods.forEach((m) => { counts[m] = (counts[m] || 0) + 1; });
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const shuffled = [...PALETTE].sort(() => Math.random() - 0.5);
  return top.map(([text, value], i) => ({
    text,
    value,
    color: shuffled[i % shuffled.length],
  }));
}

function MoodCloud({ moods }) {
  const words = useMemo(() => buildWords(moods), [moods]);
  if (words.length === 0) return null;
  return (
    <div className="top-moods__cloud">
      <ReactWordcloud
        words={words}
        options={{ ...CLOUD_OPTIONS, colors: words.map((w) => w.color) }}
      />
    </div>
  );
}

function TopMoods({ actions }) {
  const { profileUser, isOwner, loading, targetId } = useTargetUser();
  const [mediaFilter, setMediaFilter] = useState([]);

  const isAll = mediaFilter.length === 0;

  const allMoods = useMemo(
    () => actions.getUserMoods(targetId, []),
    [actions, targetId]
  );

  const moodsByType = useMemo(
    () =>
      ALL_TYPES.reduce((acc, { value }) => {
        acc[value] = actions.getUserMoods(targetId, [value]);
        return acc;
      }, {}),
    [actions, targetId]
  );

  if (loading || !profileUser) return <LoadingSpinner />;

  const title = isOwner ? "Your Top Moods:" : `${profileUser.name}'s Top Moods:`;

  // which types to show columns for
  const activeTypes = isAll
    ? ALL_TYPES
    : ALL_TYPES.filter((t) => mediaFilter.includes(t.value));

  const showMerged = isAll;
  const showColumns = !isAll;

  return (
    <PageMotion>
      <h1 className="top-moods__title">{title}</h1>
      <MediaFilter value={mediaFilter} onChange={setMediaFilter} />

      {allMoods.length === 0 ? (
        <p className="top-moods__empty">No moods tracked yet.</p>
      ) : showMerged ? (
        <MoodCloud moods={allMoods} />
      ) : (
        <div className="top-moods__columns">
          {activeTypes.map(({ value, label }) =>
            moodsByType[value].length === 0 ? null : (
              <div key={value} className="top-moods__column">
                <p className="top-moods__column-label">{label}</p>
                <MoodCloud moods={moodsByType[value]} />
              </div>
            )
          )}
        </div>
      )}
    </PageMotion>
  );
}

export default TopMoods;