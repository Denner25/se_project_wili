import ItemCard from "../ItemCard/ItemCard";
import "./Main.css";
import Spotlights from "../Spotlights/Spotlights";

function Main({ items, onCardClick, allUsersMoods, latestItems }) {
  return (
    <main className="main">
      <Spotlights latestItems={latestItems} />
      {items.length === 0 ? (
        <p className="main__empty">No items saved yet.</p>
      ) : (
        <>
          <div className="main__container">
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
          </div>
        </>
      )}
    </main>
  );
}

export default Main;
