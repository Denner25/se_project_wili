import { useOutletContext } from "react-router-dom";
import ItemsSection from "../ItemsSection/ItemsSection";
import "./Profile.css";

function Profile({ items, onCardClick, onDeleteRequest }) {
  const { profileUser, isOwner } = useOutletContext();

  return (
    <ItemsSection
      items={items}
      profileUser={profileUser}
      isOwner={isOwner}
      showAllMoods={false}
      onCardClick={onCardClick}
      onDeleteRequest={onDeleteRequest}
    />
  );
}

export default Profile;
