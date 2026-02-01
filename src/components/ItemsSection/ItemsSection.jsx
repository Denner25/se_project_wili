import ItemCard from "../ItemCard/ItemCard";
import Pagination from "../Pagination/Pagination";
import usePagination from "../../hooks/usePagination";
import { useRef } from "react";
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

  const topRef = useRef(null);
  const { currentItems, currentPage, totalPages, goToPage } = usePagination(
    userItems,
    20,
  );

  const handlePageSelect = (newPage) => {
    goToPage(newPage); // updates the currentPage
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="items-section" ref={topRef}>
      {userItems.length === 0 ? (
        <p className="items-section__empty">No items yet.</p>
      ) : (
        <>
          <p className="items-section__text">
            {`${isOwner ? "Your" : `${profileUser.name}'s`} movies and animes:`}
          </p>

          <div className="items-section__list">
            {currentItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                showAllMoods={showAllMoods}
                onClick={() => onCardClick(item)}
                onDeleteRequest={onDeleteRequest}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageSelect={handlePageSelect}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ItemsSection;
