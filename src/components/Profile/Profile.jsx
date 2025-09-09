import ItemsSection from "../ItemsSection/ItemsSection";
import SideBar from "../SideBar/SideBar";
import "./Profile.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Profile({
  items,
  onCardClick,
  onEditProfile,
  onDeleteRequest,
  onLogOut,
}) {
  const currentUser = useContext(CurrentUserContext);
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
          showAllMoods={false}
          onCardClick={onCardClick}
          onDeleteRequest={onDeleteRequest}
        />
      </section>
    </div>
  );
}

export default Profile;
