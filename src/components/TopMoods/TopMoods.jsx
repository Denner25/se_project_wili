import { useMemo } from "react";
import ReactWordcloud from "react-wordcloud";
import PageWithSidebar from "../PageWithSidebar/PageWithSidebar";
import "./TopMoods.css";

function TopMoods({ userMoods, onEditProfile, onLogOut }) {
  const colors = [
    "#26c6da",
    "#29c331",
    "#ff7043",
    "#ab47bc",
    "#fffb26",
    "#29b6f6",
    "#ef5350",
  ];

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
    <PageWithSidebar onEditProfile={onEditProfile} onLogOut={onLogOut}>
      {words.length === 0 ? (
        <p className="top-moods__empty">No moods tracked yet.</p>
      ) : (
        <>
          <h1 className="top-moods__title">Your Top Moods:</h1>
          <div className="top-moods__cloud">
            <ReactWordcloud words={words} options={options} />
          </div>
        </>
      )}
    </PageWithSidebar>
  );
}

export default TopMoods;
