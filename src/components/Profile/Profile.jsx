import ItemsSection from "../ItemsSection/ItemsSection";
import SideBar from "../SideBar/SideBar";
import "./Profile.css";

function Profile({ items, onCardClick, onEdit }) {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar onEdit={onEdit} />
      </section>
      <section className="profile__items-section">
        <ItemsSection items={items} onCardClick={onCardClick} />
      </section>
    </div>
  );
}

export default Profile;
