import "./Header.css";
import Autocomplete from "../Autocomplete/Autocomplete";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";

function Header({ onItemClick }) {
  return (
    <header className="header">
      <p className="header__logo">wili</p>
      <Autocomplete onSelect={onItemClick} />
      <div className="header__user-container">
        <Link className="header__link" to="/profile">
          <p className="header__username">Denner Cardoso</p>
          <img src={avatar} alt="User Avatar" className="header__avatar" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
