import ItemCard from "../ItemCard/ItemCard";
import Spotlights from "../Spotlights/Spotlights";
import Pagination from "../Pagination/Pagination";
import usePagination from "../../hooks/usePagination";
import "./Main.css";

function Main({ items, onCardClick, allUsersMoods, latestItems }) {
  const { currentItems, currentPage, totalPages, goToPage } = usePagination(
    items,
    18,
  ); // 18 items per page

  return (
    <main className="main">
      <Spotlights latestItems={latestItems} />

      {items.length === 0 ? (
        <p className="main__empty">No items saved yet.</p>
      ) : (
        <div className="main__container">
          <p className="main__text">What people are liking:</p>

          <div className="main__grid">
            {currentItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onClick={() => onCardClick(item)}
                hideDelete
                allUsersMoods={allUsersMoods}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageSelect={goToPage}
          />
        </div>
      )}
    </main>
  );
}

export default Main;
