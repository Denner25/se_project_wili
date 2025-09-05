import "./SideBar.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function SideBar({ onEditProfile, onLogOut }) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <div className="sidebar">
      <Link className="sidebar__profile" to="/profile">
        {currentUser?.avatarUrl ? (
          <img
            className="sidebar__avatar"
            src={currentUser.avatarUrl}
            alt="User Avatar"
          />
        ) : (
          <div className="sidebar__avatar-placeholder">
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <p className="sidebar__username">{currentUser?.name}</p>
      </Link>
      <div className="sidebar__buttons">
        <button className="sidebar__button" onClick={onEditProfile}>
          Edit profile
        </button>
        <Link className="sidebar__link" to="/top-moods">
          <button className="sidebar__button">Your top moods</button>
        </Link>
        <button className="sidebar__button" onClick={onLogOut}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default SideBar;
