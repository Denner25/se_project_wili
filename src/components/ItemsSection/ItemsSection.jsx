import ItemCard from "../ItemCard/ItemCard";
import Pagination from "../Pagination/Pagination";
import MediaFilter from "../MediaFilter/MediaFilter";
import usePagination from "../../hooks/usePagination";
import { useOutletContext } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useRef, useState } from "react";
import "./ItemsSection.css";

const SECTION_LABELS = {
  movie: "movies and anime",
  music: "music",
  book: "books",
};

function getHeadingLabel(mediaFilter) {
  if (mediaFilter.length === 0 || mediaFilter.length === 3) return "collection";
  if (mediaFilter.length === 1) return SECTION_LABELS[mediaFilter[0]] ?? "collection";
  return mediaFilter.map((f) => SECTION_LABELS[f]).join(" & ");
}

function ItemsSection({ items, onCardClick, onDeleteRequest, showAllMoods }) {
  const { profileUser, loading, isOwner } = useOutletContext();
  const [mediaFilter, setMediaFilter] = useState([]);
  const topRef = useRef(null);

  if (loading || !profileUser) return <LoadingSpinner />;

  const userItems = items
    .filter((item) => mediaFilter.length === 0 || mediaFilter.includes(item.mediaType))
    .map((item) => {
      const moods = item.moods || [];
      const filteredMoods = showAllMoods
        ? moods
        : moods.filter((m) => m.users.includes(profileUser._id));
      if (filteredMoods.length === 0) return null;
      return { ...item, moods: filteredMoods };
    })
    .filter(Boolean);

  const { currentItems, currentPage, totalPages, goToPage } = usePagination(
    userItems,
    20
  );

  const handlePageSelect = (newPage) => {
    goToPage(newPage);
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const ownerLabel = isOwner ? "Your" : `${profileUser.name}'s`;

  return (
    <div className="items-section" ref={topRef}>
      <p className="items-section__text">
        {`${ownerLabel} ${getHeadingLabel(mediaFilter)}:`}
      </p>
      <MediaFilter value={mediaFilter} onChange={setMediaFilter} />

      {userItems.length === 0 ? (
        <p className="items-section__empty">No items yet.</p>
      ) : (
        <>
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