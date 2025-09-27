import "./SideBar.css";
import { Link } from "react-router-dom";

function SideBar({ profileUser, isOwner, onEditProfile, onLogOut }) {
  if (!profileUser) return null;

  return (
    <div className="sidebar">
      <Link className="sidebar__profile" to={`/users/${profileUser._id}`}>
        <img
          className="sidebar__avatar"
          src={profileUser.avatarUrl}
          alt={`${profileUser.name}'s avatar`}
        />
        <p className="sidebar__username">{profileUser.name}</p>
      </Link>

      {isOwner && (
        <div className="sidebar__buttons">
          <button className="sidebar__button" onClick={onEditProfile}>
            Edit profile
          </button>
          <Link className="sidebar__link" to="/top-moods">
            <button className="sidebar__button">
              {`${isOwner ? "Your" : `${profileUser.name}'s`} Top Moods`}
            </button>
          </Link>
          <button className="sidebar__button" onClick={onLogOut}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default SideBar;
