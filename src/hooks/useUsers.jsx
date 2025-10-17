// filepath: c:\Users\Denner Cardoso\Documents\TripleTen\Sprint 16\frontend\src\hooks\useUsers.js
import { useState, useEffect } from "react";
import { getUsers } from "../utils/Api";

const useUsers = (query, token) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUsers(query, token)
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [query, token]);

  return { users, loading };
};

export default useUsers;
