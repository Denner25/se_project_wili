import { useState, useEffect, useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import { getUserById } from "../utils/Api";

export default function useUser(targetId) {
  const currentUser = useContext(CurrentUserContext);
  const [fetchedUser, setFetchedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = targetId === currentUser?._id;

  useEffect(() => {
    // If viewing own profile, no fetch needed — use context directly
    if (isOwnProfile) {
      setLoading(false);
      return;
    }

    if (!targetId) return;

    const token = localStorage.getItem("jwt");
    setLoading(true);

    getUserById(targetId, token)
      .then(setFetchedUser)
      .catch((err) => {
        console.error("useUser error:", err);
        setFetchedUser(null);
      })
      .finally(() => setLoading(false));
  }, [targetId, isOwnProfile]);

  // Own profile always comes from context so it stays in sync
  const profileUser = isOwnProfile ? currentUser : fetchedUser;

  return { profileUser, loading };
}