import ItemCard from "../ItemCard/ItemCard";
import Pagination from "../Pagination/Pagination";
import MediaFilter from "../MediaFilter/MediaFilter";
import usePagination from "../../hooks/usePagination";
import { useOutletContext } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { useRef, useState, useContext } from "react";
import "./ItemsSection.css";

const SECTION_LABELS = {
  movie: "movies and anime",
  tv: "movies and anime",
  anime: "movies and anime",
  music: "music",
  book: "books",
  game: "games",
};

function getHeadingLabel(mediaFilter) {
  if (mediaFilter.length === 0) return "collection";
  const labels = [...new Set(mediaFilter.map((f) => SECTION_LABELS[f]))].filter(Boolean);
  if (labels.length === 0) return "collection";
  if (mediaFilter.length === 6) return "collection";
  return labels.join(" & ");
}

function ItemsSection({ items, onCardClick, onDeleteRequest, onPrivacyChange, showAllMoods }) {
  const { profileUser, loading, isOwner } = useOutletContext();
  const { user: currentUser } = useContext(CurrentUserContext);
  const [mediaFilter, setMediaFilter] = useState([]);
  const topRef = useRef(null);

  if (loading || !profileUser) return <LoadingSpinner />;

  // Only block visitors — never the owner viewing their own profile
  if (!isOwner && profileUser.collectionPrivate) {
    return (
      <div className="items-section items-section--private">
        <p className="items-section__private-msg">
          {profileUser.name}'s collection is private.
        </p>
      </div>
    );
  }

  const privateItemIds = new Set(
    !isOwner ? (profileUser.privateItems || []).map(String) : []
  );

  const userItems = items
    .filter((item) =>
      mediaFilter.length === 0 || mediaFilter.includes(item.mediaType)
    )
    .map((item) => {
      const moods = item.moods || [];

      let filteredMoods;
      if (isOwner) {
        // Owner always sees their own moods — privacy only affects what others see
        filteredMoods = showAllMoods
          ? moods
          : moods.filter((m) => m.users.includes(profileUser._id));
      } else {
        // Visitor: strip the profile user's mood contribution on private items
        const visibleMoods = privateItemIds.has(String(item._id))
          ? moods
              .map((mood) => ({
                ...mood,
                users: mood.users.filter((uid) => uid !== profileUser._id),
              }))
              .filter((mood) => mood.users.length > 0)
          : moods;

        filteredMoods = showAllMoods
          ? visibleMoods
          : visibleMoods.filter((m) => m.users.includes(profileUser._id));
      }

      if (filteredMoods.length === 0) return null;
      return { ...item, moods: filteredMoods };
    })
    .filter(Boolean);

  const { currentItems, currentPage, totalPages, goToPage } = usePagination(userItems, 20);

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
                onPrivacyChange={isOwner ? onPrivacyChange : undefined}
                privateItems={isOwner ? (currentUser?.privateItems || []) : []}
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