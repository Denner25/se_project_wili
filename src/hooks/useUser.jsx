import { useState, useEffect, useContext } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";
import { getUserById } from "../utils/Api";

export default function useUser(targetId) {
  const currentUser = useContext(CurrentUserContext);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetId) return;
    const token = localStorage.getItem("jwt");

    setLoading(true);
    getUserById(targetId === currentUser?._id ? undefined : targetId, token)
      .then(setProfileUser)
      .catch((err) => {
        console.error("useUser error:", err);
        setProfileUser(null);
      })
      .finally(() => setLoading(false));
  }, [targetId, currentUser?._id]);

  return { profileUser, loading };
}
