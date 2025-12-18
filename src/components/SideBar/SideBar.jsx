import "./SideBar.css";
import { Link } from "react-router-dom";

function SideBar({ profileUser, isOwner, onEditProfile, onLogOut }) {
  if (!profileUser) return null;

  return (
    <div className="sidebar">
      <Link className="sidebar__profile" to={`/profile/${profileUser._id}`}>
        <img
          className="sidebar__avatar"
          src={profileUser.avatarUrl}
          alt={`${profileUser.name}'s avatar`}
        />
        <p className="sidebar__username">{profileUser.name}</p>
      </Link>

      <div className="sidebar__buttons">
        {/* Always visible */}
        <Link
          className="sidebar__link"
          to={isOwner ? "/wili-ai" : `/wili-ai/${profileUser._id}`}
        >
          <button className="sidebar__button">Would I like it?</button>
        </Link>

        <Link
          className="sidebar__link"
          to={isOwner ? "/top-moods" : `/top-moods/${profileUser._id}`}
        >
          <button className="sidebar__button">
            {isOwner ? "Your Top Moods" : `${profileUser.name}'s Top Moods`}
          </button>
        </Link>

        {/* Owner-only */}
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
