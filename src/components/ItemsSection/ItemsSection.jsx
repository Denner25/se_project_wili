import ItemCard from "../ItemCard/ItemCard";
import "./ItemsSection.css";

function ItemsSection({ items, onItemClick }) {
  return (
    <div className="items-section">
      <div className="items-section__grid">
        {items.length === 0 ? (
          <p className="items-section__empty">No items yet.</p>
        ) : (
          items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onItemClick(item)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ItemsSection;
