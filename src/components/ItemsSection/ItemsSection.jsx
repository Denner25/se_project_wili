import ItemCard from "../ItemCard/ItemCard";
import "./ItemsSection.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemsSection({ items, onCardClick, onDeleteRequest }) {
  const currentUser = useContext(CurrentUserContext);
  const userItems = items.filter((item) => item.owner === currentUser?._id);

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
