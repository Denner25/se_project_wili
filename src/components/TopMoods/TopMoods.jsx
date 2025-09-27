import { useMemo, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactWordcloud from "react-wordcloud";

import CurrentUserContext from "../../contexts/CurrentUserContext";
import PageWithSidebar from "../PageWithSidebar/PageWithSidebar";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import useUser from "../../hooks/useUser";

import "./TopMoods.css";

function TopMoods({ userMoods, onEditProfile, onLogOut }) {
  const currentUser = useContext(CurrentUserContext);
  const { userId } = useParams();
  const targetId = userId || currentUser?._id;

  // always call the hook; if parent already passed profileUser, fetched value may be unused
  const { profileUser, loading } = useUser(targetId);

  const moodCounts = useMemo(() => {
    const counts = {};
    userMoods.forEach((m) => (counts[m] = (counts[m] || 0) + 1));
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [userMoods]);

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

  if ((loading && !profileUser) || !profileUser) return <LoadingSpinner />;

  const isOwner = currentUser?._id === profileUser._id;

  return (
    <PageWithSidebar
      profileUser={profileUser}
      isOwner={isOwner}
      onEditProfile={onEditProfile}
      onLogOut={onLogOut}
    >
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
    </PageWithSidebar>
  );
}

export default TopMoods;
