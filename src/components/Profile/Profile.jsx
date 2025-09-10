import ItemsSection from "../ItemsSection/ItemsSection";
import PageWithSidebar from "../PageWithSidebar/PageWithSidebar";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import "./Profile.css";

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
    <PageWithSidebar onEditProfile={onEditProfile} onLogOut={onLogOut}>
      <ItemsSection
        items={items}
        showAllMoods={false}
        onCardClick={onCardClick}
        onDeleteRequest={onDeleteRequest}
      />
    </PageWithSidebar>
  );
}

export default Profile;
