import "./SideBar.css";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function SideBar({ onEditProfile, onLogOut }) {
  const currentUser = useContext(CurrentUserContext);
  return (
    <div className="sidebar">
      <div className="sidebar__profile">
        <img className="sidebar__avatar" src={avatar} alt="User Avatar" />
        <p className="sidebar__username">{currentUser?.name}</p>
      </div>
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
