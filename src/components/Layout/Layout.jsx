import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Layout.css";

function Layout({
  onItemClick,
  resetAutocomplete,
  onSignUpClick,
  onLogInClick,
  isLoggedIn,
}) {
  return (
    <div className="app">
      <div className="app__content">
        <Header
          onItemClick={onItemClick}
          resetAutocomplete={resetAutocomplete}
          onSignUpClick={onSignUpClick}
          onLogInClick={onLogInClick}
          isLoggedIn={isLoggedIn}
        />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
