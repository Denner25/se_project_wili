import { useState, useEffect } from "react";
import { checkToken } from "../utils/auth";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Bootstrap user from localStorage token
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    checkToken(token)
      .then((user) => {
        setCurrentUser(user);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        setCurrentUser(null);
        setIsLoggedIn(false);
      });
  }, []);

  return {
    currentUser,
    setCurrentUser,
    isLoggedIn,
    setIsLoggedIn,
  };
}
