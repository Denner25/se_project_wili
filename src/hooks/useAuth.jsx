import { useState, useEffect } from "react";
import { checkToken } from "../utils/auth";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setIsLoaded(true);
      return;
    }

    checkToken(token)
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        setCurrentUser(null);
        setIsLoggedIn(false);
      })
      .finally(() => setIsLoaded(true));
  }, []);

  return {
    currentUser,
    setCurrentUser,
    isLoggedIn,
    setIsLoggedIn,
    isLoaded,
    isLoggingOut,
    setIsLoggingOut,
  };
}
