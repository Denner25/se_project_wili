import { useMemo } from "react";
import ReactWordcloud from "react-wordcloud";
import "./TopMoods.css";
import SideBar from "../SideBar/SideBar";

function TopMoods({ userMoods, onEditProfile }) {
  const colors = [
    "#26c6da",
    "#29c331",
    "#ff7043",
    "#ab47bc",
    "#fffb26",
    "#29b6f6",
    "#ef5350",
  ];

  // Count top 10 moods
  const moodCounts = useMemo(() => {
    const counts = {};
    userMoods.forEach((mood) => {
      counts[mood] = (counts[mood] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [userMoods]);

  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const words = useMemo(() => {
    const shuffledColors = shuffleArray(colors);
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
    <div className="top-moods">
      <section className="top-moods__sidebar">
        <SideBar onEditProfile={onEditProfile} />
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
