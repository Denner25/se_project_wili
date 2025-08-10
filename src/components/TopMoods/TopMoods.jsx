import { useMemo } from "react";
import ReactWordcloud from "react-wordcloud";
import "./TopMoods.css";
import SideBar from "../SideBar/SideBar";

function TopMoods({ savedItems, onEditProfile, profileName }) {
  const colors = [
    "#26c6da",
    "#29c331",
    "#ff7043",
    "#ab47bc",
    "#fffb26",
    "#29b6f6",
    "#ef5350",
  ];

  // Count moods and take top 10
  const moodCounts = useMemo(() => {
    const counts = {};
    savedItems.forEach((item) => {
      (item.tags || []).forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [savedItems]);

  // Shuffle helper to randomize colors
  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // Assign colors in shuffled order without skipping any
  const words = useMemo(() => {
    const shuffledColors = shuffleArray(colors);
    return moodCounts.map(([tag, count], i) => ({
      text: tag,
      value: count,
      color: shuffledColors[i % shuffledColors.length],
    }));
  }, [moodCounts]);

  // Wordcloud options
  const options = {
    colors: words.map((w) => w.color),
    rotations: 0, // no rotation for readability
    fontFamily: "Poppins, sans-serif",
    fontWeight: "700",
    fontSizes: [18, 70], // min and max font size
    padding: 2,
    deterministic: false, // random placement each render
  };

  return (
    <div className="top-moods">
      <section className="top-moods__sidebar">
        <SideBar onEditProfile={onEditProfile} profileName={profileName} />
      </section>
      <div className="top-moods__content">
        {words.length === 0 ? (
          <p className="top-moods__empty">No moods tracked yet.</p>
        ) : (
          <>
            <h2>Your Top Moods:</h2>
            <div className="top-moods__cloud">
              <ReactWordcloud words={words} options={options} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TopMoods;
