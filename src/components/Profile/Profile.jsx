import ItemsSection from "../ItemsSection/ItemsSection";
import SideBar from "../SideBar/SideBar";
import "./Profile.css";

function Profile({ items, onCardClick, onEdit, onDelete }) {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar onEdit={onEdit} />
      </section>
      <section className="profile__items-section">
        <ItemsSection
          items={items}
          onCardClick={onCardClick}
          onDelete={onDelete}
        />
      </section>
    </div>
  );
}

export default Profile;
