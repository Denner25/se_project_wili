import "./SideBar.css";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";

function SideBar({ onEditProfile }) {
  return (
    <div className="sidebar">
      <div className="sidebar__profile">
        <img className="sidebar__avatar" src={avatar} alt="User Avatar" />
        <p className="sidebar__username">Denner Cardoso</p>
      </div>
      <div className="sidebar__buttons">
        <button className="sidebar__button" onClick={onEditProfile}>
          Edit profile
        </button>
        <Link className="sidebar__link" to="/top-moods">
          <button className="sidebar__button">Your top moods</button>
        </Link>
      </div>
    </div>
  );
}

export default SideBar;
