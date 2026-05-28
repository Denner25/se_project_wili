import { useState, useEffect } from "react";
import {
  getItems,
  addItem,
  getLatestItems,
  updateItemMoods,
  deleteItem,
  updateProfile,
  getUserItems,
} from "../utils/Api";

export default function useItems() {
  const [allUsersMoods, setAllUsersMoods] = useState([]);
  const [ownerItems, setOwnerItems] = useState([]);
  const [latestItems, setLatestItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const sort = (data) =>
      (data || []).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const publicFetch = getItems().then((res) => {
      setAllUsersMoods(sort(res.data));
    });

    const ownerFetch = token
      ? getUserItems(token).then((res) => {
          setOwnerItems(sort(res.data));
        })
      : Promise.resolve();

    Promise.all([publicFetch, ownerFetch])
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
    ownerItems,
    setOwnerItems,
    latestItems,
    setLatestItems,
    isLoaded,
    updateItemMoods,
    addItem,
    deleteItem,
    updateProfile,
  };
}