import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext";
import { getUserById } from "../utils/Api";

export default function useTargetUser() {
  const { user: currentUser } = useContext(CurrentUserContext);
  const { userId } = useParams();

  const [fetchedUser, setFetchedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // If no userId param, we're on the owner's own profile
  const isOwnProfile = !userId || userId === currentUser?._id;

  useEffect(() => {
    // Own profile — no fetch needed, context is the source of truth
    if (isOwnProfile) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("jwt");
    setLoading(true);

    getUserById(userId, token)
      .then(setFetchedUser)
      .catch((err) => {
        console.error("useTargetUser error:", err);
        setFetchedUser(null);
      })
      .finally(() => setLoading(false));
  }, [userId, isOwnProfile]);

  // Own profile always reads from context so updates are instant
  const profileUser = isOwnProfile ? currentUser : fetchedUser;
  const isOwner = isOwnProfile;
  const targetId = profileUser?._id;

  return { profileUser, isOwner, loading, targetId };
}