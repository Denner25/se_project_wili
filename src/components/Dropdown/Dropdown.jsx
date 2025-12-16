import "./Dropdown.css";

function Dropdown({ items, onItemClick }) {
  if (!items.length) return null;

  return (
    <ul className="dropdown">
      {items.map((item) => (
        <li
          key={`${item.mediaType}-${item.id}`}
          className="dropdown__item"
          onClick={() => onItemClick(item)}
        >
          {item.poster && (
            <img
              src={item.poster}
              alt={item.title}
              className="dropdown__poster"
            />
          )}

          {item.avatar && (
            <img
              src={item.avatar}
              alt={item.title}
              className="dropdown__poster"
            />
          )}

          <div className="dropdown__info">
            <div className="dropdown__title">{item.title}</div>
            <div className="dropdown__subtitle">
              {item.mediaType === "user"
                ? "User"
                : item.mediaType === "movie"
                ? "Movie"
                : "TV"}
              {item.length ? ` • ${item.length}` : ""}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Dropdown;
