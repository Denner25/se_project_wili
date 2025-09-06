import { useMemo } from "react";
import ReactWordcloud from "react-wordcloud";
import "./TopMoods.css"; // reuse your existing styles

function MoodsCloud({ moods }) {
  const moodCounts = useMemo(() => {
    const counts = {};
    moods.forEach((mood) => {
      counts[mood] = (counts[mood] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [moods]);

  const colors = [
    "#26c6da",
    "#29c331",
    "#ff7043",
    "#ab47bc",
    "#fffb26",
    "#29b6f6",
    "#ef5350",
  ];

  const words = useMemo(() => {
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    return moodCounts.map(([tag, count], i) => ({
      text: tag,
      value: count,
      color: shuffledColors[i % shuffledColors.length],
    }));
  }, [moodCounts]);

  const options = {
    colors: words.map((w) => w.color),
    rotations: 0,
    fontFamily: "Poppins, sans-serif",
    fontWeight: "700",
    fontSizes: [18, 70],
    padding: 2,
    deterministic: false,
  };

  return (
    <div className="top-moods__content">
      {words.length === 0 ? (
        <p className="top-moods__empty">No moods tracked yet.</p>
      ) : (
        <div className="top-moods__cloud">
          <ReactWordcloud words={words} options={options} />
        </div>
      )}
    </div>
  );
}

export default MoodsCloud;
