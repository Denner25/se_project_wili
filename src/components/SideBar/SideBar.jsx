import "./SideBar.css";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";
import { useContext } from "react";
import getFirstName from "../../utils/getFirstName";
import Chats from "../Chats/Chats";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function SideBar({ profileUser, isOwner, onLogOut }) {
  const targetFirstName = getFirstName(profileUser?.name);
  const { token } = useContext(CurrentUserContext);

  if (!profileUser) return null;

  const chatsPath = useResolvedPath("wili-ai");
  const chatsMatch = useMatch({ path: chatsPath.pathname, end: false });

  return (
    <div className="sidebar">
      {/* Profile root */}
      <NavLink
        to="."
        end
        className={({ isActive }) =>
          `sidebar__profile sidebar__link ${
            isActive ? "sidebar__link--active" : ""
          }`
        }
      >
        <img
          className="sidebar__avatar"
          src={profileUser.avatarUrl}
          alt={`${profileUser.name}'s avatar`}
        />
        <p className="sidebar__username">{profileUser.name}</p>
      </NavLink>

      <div className="sidebar__buttons">
        {/* Chats (active via route match, NOT NavLink) */}
        <div
          className={`sidebar__link ${
            chatsMatch ? "sidebar__link--active" : ""
          }`}
        >
          <Chats token={token} />
        </div>

        <NavLink
          to="top-moods"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          <button className="sidebar__button">
            {isOwner ? "Your Top Moods" : `${targetFirstName}'s Top Moods`}
          </button>
        </NavLink>

        {/* Owner-only actions */}
        {isOwner && (
          <>
            <NavLink
              to="settings"
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
            >
              <button className="sidebar__button">Settings</button>
            </NavLink>

            <button className="sidebar__button" onClick={onLogOut}>
              Log out
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SideBar;