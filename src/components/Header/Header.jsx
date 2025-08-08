import "./Header.css";
import Autocomplete from "../Autocomplete/Autocomplete";
import avatar from "../../assets/avatar.png";
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

  // moved `query` and `setQuery` state from the top-level component
  // into the Header component to localize control and reduce unnecessary
  // re-renders of word cloud component and still be able to resetAutocomplete

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

      <div className="header__group">
        {currentUser ? (
          <Link className="header__link" to="/profile">
            <p className="header__username">{currentUser.name}</p>
            {avatar ? (
              <img src={avatar} alt="User Avatar" className="header__avatar" />
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
      </div>
    </header>
  );
}

export default Header;
