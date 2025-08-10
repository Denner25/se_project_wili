import "./ItemCard.css";

function ItemCard({ item, onClick, onDeleteRequest, hideDelete }) {
  const showDelete = !hideDelete && item.tags && item.tags.length > 0;

  return (
    <div className="item-card" onClick={onClick}>
      <div className="item-card__poster-wrapper">
        {showDelete && (
          <button
            type="button"
            className="item-card__delete"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest?.(item.id);
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
          {item.tags && item.tags.length > 0
            ? item.tags.join(", ")
            : "No moods"}
        </p>
      </div>
    </div>
  );
}

export default ItemCard;
