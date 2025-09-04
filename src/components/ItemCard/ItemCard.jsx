import "./ItemCard.css";

function ItemCard({
  item,
  allUsersMoods,
  onClick,
  onDeleteRequest,
  hideDelete,
}) {
  const showDelete = !hideDelete && item.tags && item.tags.length > 0;

  // ✅ Find the freshest version of this item from allUsersMoods
  const cardMoods = allUsersMoods?.find((i) => i._id === item._id) || item;

  return (
    <div className="item-card" onClick={onClick}>
      <div className="item-card__poster-wrapper">
        {showDelete && (
          <button
            type="button"
            className="item-card__delete"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest?.(item._id);
            }}
          />
        )}
        {cardMoods.poster && (
          <img
            src={cardMoods.poster.replace("/w92", "/w342")}
            alt={cardMoods.title}
            className="item-card__poster"
          />
        )}
      </div>
      <div className="item-card__info">
        <h4 className="item-card__title">{cardMoods.title}</h4>
        <p className="item-card__moods">
          {cardMoods.moods && cardMoods.moods.length > 0
            ? cardMoods.moods.map((m) => m.name).join(", ")
            : "No moods"}
        </p>
      </div>
    </div>
  );
}

export default ItemCard;
