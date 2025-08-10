import "./App.css";
import Header from "../Header/Header";
import ItemModal from "../ItemModal/ItemModal";
import { useState, useEffect } from "react";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Profile from "../Profile/Profile";
import { Routes, Route, useNavigate } from "react-router-dom";
import TopMoods from "../TopMoods/TopMoods";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import LogInModal from "../LogInModal/LogInModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import {
  getItems,
  addItem,
  deleteItem,
  updateItemTags,
  getCurrentUser,
  updateProfile,
} from "../../utils/Api";

import { signup, login, checkToken } from "../../utils/auth";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [resetAutocomplete, setResetAutocomplete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      getCurrentUser(token)
        .then((user) => {
          setCurrentUser(user);
        })
        .catch(() => {
          setCurrentUser(null);
          localStorage.removeItem("jwt");
        });
      getItems(token)
        .then((res) => {
          setSavedItems(res.data);
        })
        .catch(console.error);
    } else {
      // Always fetch items for main page, even if logged out
      getItems()
        .then((res) => {
          setSavedItems(res.data);
        })
        .catch(console.error);
    }
  }, []);

  const handleConfirmDelete = () => {
    const token = localStorage.getItem("jwt");
    deleteItem(pendingDeleteId, token)
      .then(() => {
        setSavedItems((prev) =>
          prev.filter((item) => item._id !== pendingDeleteId)
        );
        setPendingDeleteId(null);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleConfirmClick = (id) => {
    setPendingDeleteId(id);
    setActiveModal("confirmation");
  };

  const handleEditProfileClick = () => setActiveModal("edit-profile");
  const handleSignUpClick = () => setActiveModal("register");
  const handleLogInClick = () => setActiveModal("log-in");

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setActiveModal("item");
  };

  const handleSave = (item) => {
    const token = localStorage.getItem("jwt");
    if (!item.tags || item.tags.length === 0) {
      if (item._id) {
        deleteItem(item._id, token)
          .then(() => {
            setSavedItems((prev) => prev.filter((i) => i._id !== item._id));
            closeActiveModal();
          })
          .catch(console.error);
      }
      return;
    }

    if (!item._id) {
      const itemToSend = {
        itemId: item.itemId || item.tmdbId || item.id,
        title: item.title,
        mediaType: item.mediaType,
        poster: item.poster,
        length: item.length,
        tags: item.tags || [],
      };
      addItem(itemToSend, token)
        .then((res) => {
          setSavedItems((prev) => [...prev, res.data]);
          setResetAutocomplete((f) => !f);
          closeActiveModal();
        })
        .catch(console.error);
    } else {
      updateItemTags(item._id, item.tags || [], token)
        .then((res) => {
          setSavedItems((prev) =>
            prev.map((i) => (i._id === res.data._id ? res.data : i))
          );
          setResetAutocomplete((f) => !f);
          closeActiveModal();
        })
        .catch(console.error);
    }
  };

  const handleProfileSave = (profileData) => {
    const token = localStorage.getItem("jwt");
    updateProfile(profileData, token)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const closeActiveModal = () => {
    setActiveModal("");
    setSelectedItem(null);
    setPendingDeleteId(null);
  };

  const handleOverlayClose = (e) => {
    if (e.target === e.currentTarget) {
      closeActiveModal();
    }
  };

  const handleSignUp = ({ name, email, password }) => {
    signup({ name, email, password })
      .then(() => {
        handleLogIn({ email, password });
      })
      .catch(console.error);
  };

  const handleLogIn = ({ email, password }) => {
    return login({ email, password }).then((res) => {
      localStorage.setItem("jwt", res.token);
      // Fetch user and items after login
      return Promise.all([checkToken(res.token), getItems(res.token)]).then(
        ([user, itemsRes]) => {
          setCurrentUser(user);
          setSavedItems(itemsRes.data);
          closeActiveModal();
          navigate("/profile");
        }
      );
    });
  };

  const handleLogOut = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    closeActiveModal();
    navigate("/");
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <div className="app__content">
          <Header
            onItemClick={handleItemClick}
            resetAutocomplete={resetAutocomplete}
            onSignUpClick={handleSignUpClick}
            onLogInClick={handleLogInClick}
            currentUser={currentUser}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Main items={savedItems} onCardClick={handleItemClick} />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  items={savedItems}
                  onCardClick={handleItemClick}
                  onDeleteRequest={handleConfirmClick}
                  onEditProfile={handleEditProfileClick}
                  onLogOut={handleLogOut}
                />
              }
            />
            <Route
              path="/top-moods"
              element={
                <TopMoods
                  savedItems={savedItems}
                  onEditProfile={handleEditProfileClick}
                />
              }
            />
          </Routes>
          <Footer />
        </div>
        <RegisterModal
          onClose={closeActiveModal}
          onOverlayClose={handleOverlayClose}
          isOpen={activeModal === "register"}
          onLogInClick={handleLogInClick}
          onSignUp={handleSignUp}
        />
        <LogInModal
          onClose={closeActiveModal}
          onOverlayClose={handleOverlayClose}
          isOpen={activeModal === "log-in"}
          onSignUpClick={handleSignUpClick}
          onLogIn={handleLogIn}
        />
        <ItemModal
          item={selectedItem}
          isOpen={activeModal === "item"}
          onOverlayClose={handleOverlayClose}
          onClose={closeActiveModal}
          onSave={handleSave}
          onDeleteRequest={handleConfirmClick}
        />
        <ConfirmationModal
          isOpen={activeModal === "confirmation"}
          onClose={closeActiveModal}
          onOverlayClose={handleOverlayClose}
          onConfirm={handleConfirmDelete}
        />
        <EditProfileModal
          isOpen={activeModal === "edit-profile"}
          onClose={closeActiveModal}
          onOverlayClose={handleOverlayClose}
          onSave={handleProfileSave}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
