import { useState, useEffect } from "react";
import { getItems, getLatestItems } from "../utils/Api";

export default function useItems() {
  const [allUsersMoods, setAllUsersMoods] = useState([]);
  const [latestItems, setLatestItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getItems()
      .then((res) => {
        setAllUsersMoods(
          res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        );
      })
      .catch(console.error)
      .finally(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    getLatestItems()
      .then((res) => setLatestItems(res))
      .catch(console.error);
  }, []);

  return {
    allUsersMoods,
    setAllUsersMoods,
    latestItems,
    setLatestItems,
    isLoaded,
  };
}
