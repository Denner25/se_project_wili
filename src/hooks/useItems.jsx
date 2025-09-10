import { useState, useEffect } from "react";
import {
  getItems,
  addItem,
  updateItemMoods,
  deleteItem,
  updateProfile,
} from "../utils/Api";

export default function useItems() {
  const [allUsersMoods, setAllUsersMoods] = useState([]);

  // Fetch items initially (optionally you can pass a token later)
  useEffect(() => {
    getItems()
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setAllUsersMoods(sorted);
      })
      .catch(console.error);
  }, []);

  return {
    allUsersMoods,
    setAllUsersMoods,
    getItems,
    addItem,
    updateItemMoods,
    deleteItem,
    updateProfile,
  };
}
