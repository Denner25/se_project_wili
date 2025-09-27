import SideBar from "../SideBar/SideBar";
import "./PageWithSidebar.css";

function PageWithSidebar({
  children,
  onEditProfile,
  onLogOut,
  profileUser,
  isOwner,
}) {
  return (
    <div className="page-with-sidebar">
      <section className="page-with-sidebar__sidebar">
        <SideBar
          onEditProfile={onEditProfile}
          onLogOut={onLogOut}
          profileUser={profileUser}
          isOwner={isOwner}
        />
      </section>
      <section className="page-with-sidebar__content">{children}</section>
    </div>
  );
}

export default PageWithSidebar;
