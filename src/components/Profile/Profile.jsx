import ItemsSection from "../ItemsSection/ItemsSection";
import PageWithSidebar from "../PageWithSidebar/PageWithSidebar";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import useUser from "../../hooks/useUser";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import useTargetUser from "../../hooks/useTargetUser";
import "./Profile.css";

function Profile({
  items,
  onCardClick,
  onEditProfile,
  onDeleteRequest,
  onLogOut,
}) {
  const { profileUser, isOwner, loading } = useTargetUser();

  if (loading || !profileUser) return <LoadingSpinner />;

  return (
    <PageWithSidebar
      profileUser={profileUser}
      isOwner={isOwner}
      onEditProfile={onEditProfile}
      onLogOut={onLogOut}
    >
      <ItemsSection
        items={items}
        profileUser={profileUser}
        isOwner={isOwner}
        showAllMoods={false}
        onCardClick={onCardClick}
        onDeleteRequest={onDeleteRequest}
      />
    </PageWithSidebar>
  );
}

export default Profile;
