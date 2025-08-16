import ItemCard from "../ItemCard/ItemCard";
import "./Main.css";
import wiliPoster from "../../assets/wili-poster.png";

function Main({ items, onCardClick, allUsersMoods }) {
  return (
    <div className="main">
      <img src={wiliPoster} alt="WILI Poster" className="main__poster" />
      {items.length === 0 ? (
        <p className="main__empty">No items saved yet.</p>
      ) : (
        <>
          <p className="main__text">What people are liking:</p>
          <div className="main__grid">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onClick={() => onCardClick(item)}
                hideDelete={true}
                allUsersMoods={allUsersMoods}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Main;
