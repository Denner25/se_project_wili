import "./SideBar.css";
import { NavLink } from "react-router-dom";
import getFirstName from "../../utils/getFirstName";

function SideBar({ profileUser, isOwner, onEditProfile, onLogOut }) {
  const targetFirstName = getFirstName(profileUser?.name);
  if (!profileUser) return null;

  const profileBasePath = isOwner ? "/profile" : `/profile/${profileUser._id}`;

  return (
    <div className="sidebar">
      <NavLink className="sidebar__profile" to={profileBasePath} end>
        <img
          className="sidebar__avatar"
          src={profileUser.avatarUrl}
          alt={`${profileUser.name}'s avatar`}
        />
        <p className="sidebar__username">{profileUser.name}</p>
      </NavLink>

      <div className="sidebar__buttons">
        <NavLink className="sidebar__link" to={`${profileBasePath}/wili-ai`}>
          <button className="sidebar__button">Would I like it?</button>
        </NavLink>

        <NavLink className="sidebar__link" to={`${profileBasePath}/top-moods`}>
          <button className="sidebar__button">
            {isOwner ? "Your Top Moods" : `${targetFirstName}'s Top Moods`}
          </button>
        </NavLink>

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
