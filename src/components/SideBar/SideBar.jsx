import "./SideBar.css";

function SideBar({ onEdit }) {
  return (
    <div className="sidebar">
      <button className="sidebar__edit-btn" onClick={onEdit}>
        Edit Profile
      </button>
    </div>
  );
}

export default SideBar;
