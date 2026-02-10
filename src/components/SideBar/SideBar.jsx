import "./SideBar.css";
import { Link } from "react-router-dom";
import getFirstName from "../../utils/getFirstName";

function SideBar({ profileUser, isOwner, onEditProfile, onLogOut }) {
  const targetFirstName = getFirstName(profileUser?.name);

  if (!profileUser) return null;

  return (
    <div className="sidebar">
      {/* Profile root */}
      <Link className="sidebar__profile" to=".">
        <img
          className="sidebar__avatar"
          src={profileUser.avatarUrl}
          alt={`${profileUser.name}'s avatar`}
        />
        <p className="sidebar__username">{profileUser.name}</p>
      </Link>

      <div className="sidebar__buttons">
        {/* Tabs */}
        <Link className="sidebar__link" to="wili-ai">
          <button className="sidebar__button">Would I like it?</button>
        </Link>

        <Link className="sidebar__link" to="top-moods">
          <button className="sidebar__button">
            {isOwner ? "Your Top Moods" : `${targetFirstName}'s Top Moods`}
          </button>
        </Link>

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
