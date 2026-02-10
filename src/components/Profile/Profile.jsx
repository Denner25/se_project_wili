import { Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import useTargetUser from "../../hooks/useTargetUser";
import "./Profile.css";

function Profile({ onEditProfile, onLogOut }) {
  const { profileUser, isOwner, loading } = useTargetUser();

  if (loading || !profileUser) return <LoadingSpinner />;

  return (
    <div className="profile">
      {/* Sidebar stays mounted */}
      <section>
        <SideBar
          profileUser={profileUser}
          isOwner={isOwner}
          onEditProfile={onEditProfile}
          onLogOut={onLogOut}
        />
      </section>
      {/* Content section swaps via Outlet */}
      <section className="profile__content">
        <Outlet context={{ profileUser, isOwner, loading }} />
      </section>
    </div>
  );
}

export default Profile;
