import "./SideBar.css";
import avatar from "../../assets/avatar.png";

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
      </div>
    </div>
  );
}

export default SideBar;
