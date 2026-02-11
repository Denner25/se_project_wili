import "./SideBar.css";
import { NavLink } from "react-router-dom";
import getFirstName from "../../utils/getFirstName";

function SideBar({ profileUser, isOwner, onEditProfile, onLogOut }) {
  const targetFirstName = getFirstName(profileUser?.name);

  if (!profileUser) return null;

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
        {/* Tabs */}
        <NavLink
          to="wili-ai"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          <button className="sidebar__button">Would I like it?</button>
        </NavLink>

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
