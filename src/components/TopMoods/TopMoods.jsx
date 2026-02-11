import { useMemo } from "react";
import ReactWordcloud from "react-wordcloud";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import useTargetUser from "../../hooks/useTargetUser";
import PageMotion from "../PageMotion/PageMotion";

import "./TopMoods.css";

function TopMoods({ actions }) {
  const { profileUser, isOwner, loading, targetId } = useTargetUser();

  // Get moods for target user via actions hook
  const targetUserMoods = useMemo(
    () => actions.getUserMoods(targetId),
    [actions, targetId],
  );

  const moodCounts = useMemo(() => {
    const counts = {};
    targetUserMoods.forEach((m) => {
      counts[m] = (counts[m] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [targetUserMoods]);

  const words = useMemo(() => {
    const palette = [
      "#26c6da",
      "#29c331",
      "#ff7043",
      "#ab47bc",
      "#fffb26",
      "#29b6f6",
      "#ef5350",
    ];
    const shuffled = [...palette].sort(() => Math.random() - 0.5);
    return moodCounts.map(([text, value], i) => ({
      text,
      value,
      color: shuffled[i % shuffled.length],
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

  if (loading || !profileUser) return <LoadingSpinner />;

  return (
    <>
      <PageMotion>
        {words.length === 0 ? (
          <p className="top-moods__empty">No moods tracked yet.</p>
        ) : (
          <>
            <h1 className="top-moods__title">
              {isOwner ? "Your Top Moods:" : `${profileUser.name}'s Top Moods:`}
            </h1>
            <div className="top-moods__cloud">
              <ReactWordcloud words={words} options={options} />
            </div>
          </>
        )}
      </PageMotion>
    </>
  );
}

export default TopMoods;
