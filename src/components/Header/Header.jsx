import "./Header.css";
import Autocomplete from "../Autocomplete/Autocomplete";

function Header({ onItemClick }) {
  return (
    <header className="header">
      <p className="header__logo">wili</p>
      <Autocomplete onSelect={onItemClick} />
    </header>
  );
}

export default Header;
