import ItemCard from "../ItemCard/ItemCard";
import "./ItemsSection.css";

function ItemsSection({
  items,
  onCardClick,
  onDeleteRequest,
  currentUser,
  showAllMoods,
}) {
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
                currentUser={currentUser}
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
