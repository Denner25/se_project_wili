import { Outlet } from "react-router-dom";
import PageWithSidebar from "../PageWithSidebar/PageWithSidebar";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import useTargetUser from "../../hooks/useTargetUser";

function ProfileShell({ onEditProfile, onLogOut }) {
  const { profileUser, isOwner, loading } = useTargetUser();

  if (loading || !profileUser) return <LoadingSpinner />;

  return (
    <PageWithSidebar
      profileUser={profileUser}
      isOwner={isOwner}
      onEditProfile={onEditProfile}
      onLogOut={onLogOut}
    >
      <Outlet context={{ profileUser, isOwner }} />
    </PageWithSidebar>
  );
}

export default ProfileShell;
