import "./Header.css";
import Autocomplete from "../Autocomplete/Autocomplete";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";

function Header({ onItemClick, onResetAutoComplete, query, setQuery }) {
  return (
    <header className="header">
      <Link className="header__link" to="/">
        <p className="header__logo">wili</p>
      </Link>
      <Autocomplete
        onSelect={onItemClick}
        onResetAutoComplete={onResetAutoComplete}
        query={query}
        setQuery={setQuery}
      />
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
