import "./Header.css";
import Autocomplete from "../Autocomplete/Autocomplete";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Header({
  onItemClick,
  resetAutocomplete,
  onSignUpClick,
  onLogInClick,
}) {
  const [query, setQuery] = useState("");
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    setQuery("");
  }, [resetAutocomplete]);

  return (
    <header className="header">
      <Link className="header__link" to="/">
        <p className="header__logo">wili</p>
      </Link>

      <Autocomplete onSelect={onItemClick} query={query} setQuery={setQuery} />

      <nav className="header__group">
        {currentUser ? (
          <Link className="header__link" to="/profile">
            <p className="header__username">{currentUser.name}</p>
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt="User Avatar"
                className="header__avatar"
              />
            ) : (
              <div className="header__avatar-placeholder">
                {currentUser.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
        ) : (
          <>
            <button
              type="button"
              className="header__auth-btn"
              onClick={onSignUpClick}
            >
              Sign Up
            </button>
            <button
              type="button"
              className="header__auth-btn"
              onClick={onLogInClick}
            >
              Log In
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
