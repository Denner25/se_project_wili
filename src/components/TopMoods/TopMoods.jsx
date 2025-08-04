import { useMemo } from "react";
import "./TopMoods.css";
import SideBar from "../SideBar/SideBar";

function TopMoods({ savedItems, onEdit }) {
  // Flatten all moods from all saved items
  const moodCounts = useMemo(() => {
    const counts = {};
    savedItems.forEach((item) => {
      (item.moods || []).forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // top 10
  }, [savedItems]);

  return (
    <div className="top-moods">
      <section className="top-moods__sidebar">
        <SideBar onEdit={onEdit} />
      </section>
      <div className="top-moods__content">
        {moodCounts.length === 0 ? (
          <p className="top-moods__empty">No moods tracked yet.</p>
        ) : (
          <>
            <h2>Your Top Moods:</h2>
            <div className="top-moods__cloud">
              {moodCounts.map(([tag, count]) => (
                <span
                  key={tag}
                  className="top-moods__tag"
                  style={{ fontSize: `${0.8 + count * 0.2}rem` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TopMoods;
