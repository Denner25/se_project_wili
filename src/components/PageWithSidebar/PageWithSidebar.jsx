import SideBar from "../SideBar/SideBar";
import "./PageWithSidebar.css";

function PageWithSidebar({ children, onEditProfile, onLogOut }) {
  return (
    <div className="page-with-sidebar">
      <section className="page-with-sidebar__sidebar">
        <SideBar onEditProfile={onEditProfile} onLogOut={onLogOut} />
      </section>
      <section className="page-with-sidebar__content">{children}</section>
    </div>
  );
}

export default PageWithSidebar;
