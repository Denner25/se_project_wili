import "./ItemCard.css";

function ItemCard({
  item,
  onClick,
  onDeleteRequest,
  hideDelete,
  allUsersMoods,
}) {
  const cardMoods =
    allUsersMoods?.find((i) => i._id === item._id)?.moods || item.moods || [];

  const showDelete = !hideDelete && cardMoods.length > 0;

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
        {item.poster && (
          <img
            src={item.poster.replace("/w92", "/w342")}
            alt={item.title}
            className="item-card__poster"
          />
        )}
      </div>
      <div className="item-card__info">
        <h4 className="item-card__title">{item.title}</h4>
        <p className="item-card__moods">
          {cardMoods.length > 0
            ? cardMoods.map((m) => m.name).join(", ")
            : "No moods"}
        </p>
      </div>
    </div>
  );
}

export default ItemCard;
