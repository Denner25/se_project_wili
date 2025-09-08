import "./Dropdown.css";
import { useContext } from "react";
import MoodsContext from "../../contexts/MoodsContext";

function Dropdown({ items, onItemClick }) {
  const { allUsersMoods } = useContext(MoodsContext);

  if (!items.length) return null;

  return (
    <ul className="dropdown">
      {items.map((item) => (
        <li
          key={`${item.mediaType}-${item.id}`}
          className="dropdown__item"
          onClick={() =>
            onItemClick(allUsersMoods.find((i) => i._id === item._id) || item)
          }
        >
          {item.poster && (
            <img
              src={item.poster}
              alt={item.title}
              className="dropdown__poster"
            />
          )}
          <div className="dropdown__info">
            <div className="dropdown__title">{item.title}</div>
            <div className="dropdown__subtitle">
              {item.mediaType === "movie" ? "Movie" : "TV"}
              {item.length ? ` • ${item.length}` : ""}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Dropdown;
