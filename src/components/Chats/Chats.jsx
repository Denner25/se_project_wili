import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ChatsContext } from "../../contexts/ChatsContext";
import { getChats } from "../../utils/Api";
import useAuth from "../../hooks/useAuth";
import useTargetUser from "../../hooks/useTargetUser";
import "./Chats.css";

function Chats() {
  const { token, currentUser } = useAuth();
  const { isOwner } = useTargetUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeChatId, setActiveChatId] = useState(null);

  const { chats, setChats, removeChat } = useContext(ChatsContext);

  const navigate = useNavigate();
  const location = useLocation();
  const isRouteActive = location.pathname === "/wili-ai";

  useEffect(() => {
    if (!isOwner || !token) return;
    setLoading(true);
    getChats(token)
      .then((data) => {
        setChats(data.chats || []);
        setError("");
      })
      .catch((err) => setError(err.message || "Failed to load chats"))
      .finally(() => setLoading(false));
  }, [isOwner, token]);

  const handleNewChat = () => navigate("wili-ai");

  return (
    <div className="sidebar__dropdown">
      <button
        className={`sidebar__button ${dropdownOpen || isRouteActive ? "active" : ""}`}
        onClick={
          isOwner ? () => setDropdownOpen((open) => !open) : handleNewChat
        }
      >
        Would I like it?
        {isOwner && (
          <span className={`sidebar__arrow ${dropdownOpen ? "open" : ""}`}>
            ›
          </span>
        )}
      </button>

      <div
        className={`sidebar__dropdown-content ${
          dropdownOpen && isOwner ? "sidebar__dropdown-content--open" : ""
        }`}
      >
        <button className="sidebar__new-chat" onClick={handleNewChat}>
          + New Chat
        </button>

        {loading ? (
          <p className="sidebar__loading">Loading...</p>
        ) : error ? (
          <p className="sidebar__error">{error}</p>
        ) : chats.length > 0 ? (
          <ul className="sidebar__chat-list">
            {chats.map((chat) => {
              const itemTitle = chat.aboutItem?.titleSnapshot || "Unknown Item";
              const personName =
                chat.aboutPerson?.user === currentUser?._id
                  ? "You"
                  : chat.aboutPerson?.nameSnapshot || "Unknown";

              return (
                <li
                  key={chat._id}
                  className={`sidebar__chat-item ${
                    chat._id === activeChatId
                      ? "sidebar__chat-item--active"
                      : ""
                  }`}
                  onClick={() => setActiveChatId(chat._id)}
                >
                  <NavLink
                    to={`chats/${chat._id}`}
                    className="sidebar__chat-link"
                  >
                    {itemTitle}, {personName}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="sidebar__empty">No chats yet</p>
        )}
      </div>
    </div>
  );
}

export default Chats;
