import ItemCard from "../ItemCard/ItemCard";
import Spotlights from "../Spotlights/Spotlights";
import Pagination from "../Pagination/Pagination";
import MediaFilter from "../MediaFilter/MediaFilter";
import usePagination from "../../hooks/usePagination";
import PageMotion from "../PageMotion/PageMotion";
import { useRef, useState } from "react";
import "./Main.css";

function Main({ items, onCardClick, allUsersMoods, latestItems }) {
  const topRef = useRef(null);
  const [mediaFilter, setMediaFilter] = useState([]);

  const filteredItems =
    mediaFilter.length === 0
      ? items
      : items.filter((item) => mediaFilter.includes(item.mediaType));

  const { currentItems, currentPage, totalPages, goToPage } = usePagination(
    filteredItems,
    18
  );

  const handlePageSelect = (newPage) => {
    goToPage(newPage);
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleFilterChange = (val) => {
    setMediaFilter(val);
    goToPage(1);
  };

  return (
    <PageMotion>
      <main className="main">
        <Spotlights latestItems={latestItems} />

        {items.length === 0 ? (
          <p className="main__empty">No items saved yet.</p>
        ) : (
          <div className="main__container" ref={topRef}>
            <p className="main__text">What people are liking:</p>
            <MediaFilter value={mediaFilter} onChange={handleFilterChange} />

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
              onPageSelect={handlePageSelect}
            />
          </div>
        )}
      </main>
    </PageMotion>
  );
}

export default Main;