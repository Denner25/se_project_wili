import ItemCard from "../ItemCard/ItemCard";
import "./ItemsSection.css";

function ItemsSection({ items, onCardClick }) {
  return (
    <div className="items-section">
      {items.length === 0 ? (
        <p className="items-section__empty">No items yet.</p>
      ) : (
        <>
          <p className="items-section__text">Your movies and animes:</p>
          <div className="items-section__list">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => onCardClick(item)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ItemsSection;
