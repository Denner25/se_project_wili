import ItemsSection from "../ItemsSection/ItemsSection";
import SideBar from "../SideBar/SideBar";
import "./Profile.css";

function Profile({
  items,
  onCardClick,
  onEditProfile,
  onDeleteRequest,
  onLogOut,
  currentUser,
}) {
  if (!currentUser) {
    return <div className="spinner">Loading...</div>;
  }
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar onEditProfile={onEditProfile} onLogOut={onLogOut} />
      </section>
      <section className="profile__items-section">
        <ItemsSection
          items={items}
          onCardClick={onCardClick}
          onDeleteRequest={onDeleteRequest}
        />
      </section>
    </div>
  );
}

export default Profile;
