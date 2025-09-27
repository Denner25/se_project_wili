import ItemCard from "../ItemCard/ItemCard";
import "./ItemsSection.css";

function ItemsSection({
  items,
  onCardClick,
  onDeleteRequest,
  showAllMoods,
  profileUser, // user whose profile is displayed
  isOwner, // true if current user is viewing their own profile
}) {
  const userItems = items
    .map((item) => {
      const moods = item.moods || [];

      const filteredMoods = showAllMoods
        ? moods
        : moods.filter((m) => m.users.includes(profileUser._id));

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
          <p className="items-section__text">
            {`${isOwner ? "Your" : `${profileUser.name}'s`} movies and animes:`}
          </p>
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
