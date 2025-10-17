import "./Dropdown.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MoodsContext from "../../contexts/MoodsContext";
import { getUsers } from "../../utils/Api";

function Dropdown({ items, onItemClick, query, token }) {
  const { allUsersMoods } = useContext(MoodsContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      getUsers(query, token)
        .then((fetchedUsers) => setUsers(fetchedUsers))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [query, token]);

  const combinedItems = [
    ...items,
    ...users.map((user) => ({ ...user, type: "user" })),
  ];

  if (!combinedItems.length) return null;

  const handleClick = (item) => {
    if (item.type === "user") {
      // Navigate to user's profile
      navigate(`/profile/${item._id}`);
    } else {
      // Media item → open modal
      onItemClick(allUsersMoods.find((i) => i._id === item._id) || item);
    }
  };

  return (
    <ul className="dropdown">
      {loading && <li className="dropdown__loading">Loading...</li>}
      {combinedItems.map((item) => (
        <li
          key={`${item.type}-${item._id}`}
          className="dropdown__item"
          onClick={() => handleClick(item)}
        >
          {/* Poster for media, avatar for users */}
          {item.type === "media" && item.poster && (
            <img
              src={item.poster}
              alt={item.title}
              className="dropdown__poster"
            />
          )}
          {item.type === "user" && item.avatarUrl && (
            <img
              src={item.avatarUrl}
              alt={item.name}
              className="dropdown__poster"
            />
          )}

          <div className="dropdown__info">
            {item.type === "media" ? (
              <>
                <div className="dropdown__title">{item.title}</div>
                <div className="dropdown__subtitle">
                  {item.mediaType === "movie" ? "Movie" : "TV"}
                  {item.length ? ` • ${item.length}` : ""}
                </div>
              </>
            ) : (
              <>
                <div className="dropdown__title">{item.name}</div>
                <div className="dropdown__subtitle">User</div>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Dropdown;
