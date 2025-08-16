import ItemCard from "../ItemCard/ItemCard";
import "./ItemsSection.css";

function ItemsSection({ items, userMoods, onCardClick, onDeleteRequest }) {
  // Filter items to only include moods belonging to current user
  const userItems = items
    .map((item) => {
      const filteredMoods = item.moods?.filter((m) =>
        m.users?.some((u) => userMoods.includes(m.name))
      );

      if (filteredMoods && filteredMoods.length > 0) {
        return { ...item, moods: filteredMoods };
      }
      return null;
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
