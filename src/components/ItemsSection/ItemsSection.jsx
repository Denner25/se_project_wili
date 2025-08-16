import ItemCard from "../ItemCard/ItemCard";
import "./ItemsSection.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemsSection({ items, onCardClick, onDeleteRequest }) {
  const currentUser = useContext(CurrentUserContext);

  // ✅ Filter items to only include moods that belong to current user
  const userItems = items
    .map((item) => {
      const userMoods = item.moods?.filter((mood) =>
        mood.users?.includes(currentUser?._id)
      );

      if (userMoods && userMoods.length > 0) {
        return { ...item, moods: userMoods };
      }
      return null;
    })
    .filter(Boolean); // remove nulls

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
