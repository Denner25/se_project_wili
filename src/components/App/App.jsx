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
import AvatarModal from "../AvatarModal/AvatarModal";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import {
  getItems,
  addItem,
  deleteItem,
  updateItemMoods,
  updateProfile,
} from "../../utils/Api";
import { signup, login, checkToken } from "../../utils/auth";

function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [subModal, setSubModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [resetAutocomplete, setResetAutocomplete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingAvatarUrl, setPendingAvatarUrl] = useState("");
  const [allUsersMoods, setAllUsersMoods] = useState([]);

  const navigate = useNavigate();

  // Fetch all items (all users) on load
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      checkToken(token)
        .then((user) => {
          setIsLoggedIn(true);
          setCurrentUser(user);
          return getItems(token);
        })
        .then((res) => setAllUsersMoods(res.data))
        .catch(() => {
          setIsLoggedIn(false);
          setCurrentUser(null);
          localStorage.removeItem("jwt");
          getItems()
            .then((res) => setAllUsersMoods(res.data))
            .catch(console.error);
        });
    } else {
      getItems()
        .then((res) => setAllUsersMoods(res.data))
        .catch(console.error);
    }
  }, []);

  const handleConfirmDelete = () => {
    const token = localStorage.getItem("jwt");
    deleteItem(pendingDeleteId, token)
      .then(() => {
        setAllUsersMoods((prev) =>
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

  const handleEditProfileClick = () => {
    setPendingAvatarUrl(currentUser?.avatarUrl || "");
    setActiveModal("edit-profile");
  };

  const handleSignUpClick = () => setActiveModal("register");
  const handleLogInClick = () => setActiveModal("log-in");
  const handleEditAvatarClick = () => setSubModal("avatar");
  const handleCloseAvatarModal = () => setSubModal(null);

  const handleCloseEditProfile = () => {
    setPendingAvatarUrl("");
    closeActiveModal();
  };

  const handleEditProfileOverlayClose = (e) => {
    if (e.target === e.currentTarget && !subModal) {
      setPendingAvatarUrl("");
      closeActiveModal();
      setSubModal(null);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setActiveModal("item");
  };

  // Handle adding/updating moods
  const handleSave = (item) => {
    const token = localStorage.getItem("jwt");
    if (!item) return;

    if (!item.moods || item.moods.length === 0) {
      if (item._id) {
        deleteItem(item._id, token)
          .then(() =>
            setAllUsersMoods((prev) => prev.filter((i) => i._id !== item._id))
          )
          .catch(console.error);
      }
      return;
    }

    if (!item._id) {
      const itemToSend = {
        _id: item._id || item.id,
        title: item.title,
        mediaType: item.mediaType,
        poster: item.poster,
        length: item.length,
        moods: item.moods.map((m) => ({
          name: m.name,
          users: m.users.map((u) => u.toString()),
        })),
      };

      addItem(itemToSend, token)
        .then((res) => {
          setAllUsersMoods((prev) => [...prev, res.data]);
          setResetAutocomplete((f) => !f);
          closeActiveModal();
        })
        .catch(console.error);
    } else {
      updateItemMoods(item._id, item.moods, token)
        .then((res) => {
          setAllUsersMoods((prev) =>
            prev.map((i) => (i._id === res.data._id ? res.data : i))
          );
          setResetAutocomplete((f) => !f);
          closeActiveModal();
        })
        .catch(console.error);
    }
  };

  const handleProfileSubmit = (data) => {
    const token = localStorage.getItem("jwt");
    const payload = {};
    if (typeof data.name !== "undefined") payload.name = data.name;
    payload.avatarUrl = pendingAvatarUrl || currentUser?.avatarUrl || "";

    updateProfile(payload, token)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        setPendingAvatarUrl("");
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleAvatarSave = (avatarUrl) => {
    setPendingAvatarUrl(avatarUrl);
    handleCloseAvatarModal();
  };

  const closeActiveModal = () => {
    setActiveModal("");
    setSelectedItem(null);
    setPendingDeleteId(null);
  };

  const handleOverlayClose = (e) => {
    if (e.target === e.currentTarget && !subModal) {
      closeActiveModal();
      setSubModal(null);
    }
  };

  const handleSignUp = ({ name, email, password }) => {
    signup({ name, email, password })
      .then(() => handleLogIn({ email, password }))
      .catch(console.error);
  };

  const handleLogIn = ({ email, password }) => {
    return login({ email, password }).then((res) => {
      localStorage.setItem("jwt", res.token);
      setIsLoggedIn(true);
      return Promise.all([checkToken(res.token), getItems(res.token)]).then(
        ([user, itemsRes]) => {
          setCurrentUser(user);
          setAllUsersMoods(itemsRes.data); // ✅ replace savedItems with allUsersMoods
          closeActiveModal();
          navigate("/profile");
        }
      );
    });
  };

  const handleLogOut = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);
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
            isLoggedIn={isLoggedIn}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  items={allUsersMoods}
                  onCardClick={handleItemClick}
                  allUsersMoods={allUsersMoods}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Profile
                    items={allUsersMoods}
                    onCardClick={handleItemClick}
                    onDeleteRequest={handleConfirmClick}
                    onEditProfile={handleEditProfileClick}
                    onLogOut={handleLogOut}
                    currentUser={currentUser}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/top-moods"
              element={
                <TopMoods
                  savedItems={allUsersMoods}
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
          isLoggedIn={isLoggedIn}
          onSignUpClick={handleSignUpClick}
          currentUser={currentUser}
        />
        <ConfirmationModal
          isOpen={activeModal === "confirmation"}
          onClose={closeActiveModal}
          onOverlayClose={handleOverlayClose}
          onConfirm={handleConfirmDelete}
        />
        <EditProfileModal
          isOpen={activeModal === "edit-profile"}
          onClose={handleCloseEditProfile}
          onOverlayClose={handleEditProfileOverlayClose}
          onSubmit={handleProfileSubmit}
          onOpenAvatarModal={handleEditAvatarClick}
          avatarUrl={pendingAvatarUrl || currentUser?.avatarUrl || ""}
          isLoggedIn={isLoggedIn}
        />
        <AvatarModal
          isOpen={subModal === "avatar"}
          onClose={handleCloseAvatarModal}
          isLoggedIn={isLoggedIn}
          onOverlayClose={handleOverlayClose}
          onSave={handleAvatarSave}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
