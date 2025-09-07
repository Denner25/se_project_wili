import ItemCard from "../ItemCard/ItemCard";
import "./ItemsSection.css";

function ItemsSection({ items, onCardClick, onDeleteRequest, currentUser }) {
  const userItems = items.filter((item) =>
    item.moods?.some((m) => m.users?.includes(currentUser._id))
  );

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
