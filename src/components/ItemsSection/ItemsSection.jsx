import ItemCard from "../ItemCard/ItemCard";
import "./ItemsSection.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemsSection({ items, onCardClick, onDeleteRequest, showAllMoods }) {
  const currentUser = useContext(CurrentUserContext);
  const userItems = items
    .map((item) => {
      const moods = item.moods || [];

      const filteredMoods = showAllMoods
        ? moods
        : moods.filter((m) => m.users.includes(currentUser._id));

      if (filteredMoods.length === 0) return null;

      return { ...item, moods: filteredMoods };
    })
    .filter(Boolean);

  return (
    <div className="items-section">
      {userItems.length === 0 ? (
        <p className="items-section__empty">No items yet.</p>
      ) : (
        <>
          <p className="items-section__text">Your movies and animes:</p>
          <div className="items-section__list">
            {userItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                showAllMoods={showAllMoods}
                onClick={() => onCardClick(item)}
                onDeleteRequest={onDeleteRequest}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ItemsSection;
