import { useState, useEffect } from "react";
import { checkToken } from "../utils/auth";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [token, setToken] = useState();

  useEffect(() => {
    const localToken = localStorage.getItem("jwt");
    if (!localToken) {
      setIsLoaded(true);
      return;
    }

    checkToken(localToken)
      .then((user) => {
        setCurrentUser({
          ...user,
          privateItems: (user.privateItems || []).map(String),
        });
        setIsLoggedIn(true);
        setToken(localToken);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        setCurrentUser(null);
        setIsLoggedIn(false);
        setToken(null);
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
    token,
    setToken,
  };
}