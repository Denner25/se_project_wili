import "./SideBar.css";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";
import getFirstName from "../../utils/getFirstName";
import Chats from "../Chats/Chats";
import useAuth from "../../hooks/useAuth";

function SideBar({ profileUser, isOwner, onEditProfile, onLogOut }) {
  const targetFirstName = getFirstName(profileUser?.name);
  const { token } = useAuth();

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
            <button className="sidebar__button" onClick={onEditProfile}>
              Edit profile
            </button>

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
