import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import useTargetUser from "../../hooks/useTargetUser";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import PageMotion from "../PageMotion/PageMotion";
import { useMemo } from "react";
import "./Profile.css";

function Profile({ onEditProfile, onLogOut }) {
  const location = useLocation();
  const { profileUser, isOwner, isLoading } = useTargetUser();

  // Memoize context to prevent unnecessary re-renders
  const outletContext = useMemo(
    () => ({ profileUser, isOwner, onEditProfile, onLogOut }),
    [profileUser, isOwner, onEditProfile, onLogOut],
  );

  if (isLoading || !profileUser) return <LoadingSpinner />;

  return (
    <PageMotion>
      <div className="profile">
        {/* Keep the <section> wrappers for flex layout */}
        <section className="profile__sidebar">
          <SideBar
            profileUser={profileUser}
            isOwner={isOwner}
            onEditProfile={onEditProfile}
            onLogOut={onLogOut}
          />
        </section>

        <section className="profile__content">
          <PageMotion key={location.pathname} className="profile__motion">
            <Outlet context={outletContext} />
          </PageMotion>
        </section>
      </div>
    </PageMotion>
  );
}

export default Profile;
