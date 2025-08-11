import ItemsSection from "../ItemsSection/ItemsSection";
import SideBar from "../SideBar/SideBar";
import "./Profile.css";

function Profile({
  items,
  onCardClick,
  onEditProfile,
  onDeleteRequest,
  profileName,
}) {
  return (
    <div className="profile">
      <section className="profile__sidebar">
        <SideBar onEditProfile={onEditProfile} profileName={profileName} />
      </section>
      <section className="profile__items-section">
        <ItemsSection
          items={items}
          onCardClick={onCardClick}
          onDeleteRequest={onDeleteRequest}
          profileName={profileName}
        />
      </section>
    </div>
  );
}

export default Profile;
