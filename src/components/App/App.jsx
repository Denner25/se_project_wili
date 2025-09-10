import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Layout from "../Layout/Layout";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import TopMoods from "../TopMoods/TopMoods";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import ItemModal from "../ItemModal/ItemModal";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import LogInModal from "../LogInModal/LogInModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import AvatarModal, { seeds, getAvatarUrl } from "../AvatarModal/AvatarModal";

import CurrentUserContext from "../../contexts/CurrentUserContext";
import MoodsContext from "../../contexts/MoodsContext";

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
  const [userMoods, setUserMoods] = useState([]);

  const navigate = useNavigate();

  // Keep userMoods in sync
  useEffect(() => {
    if (!allUsersMoods || !currentUser) return;

    const moods = allUsersMoods.flatMap(
      (item) =>
        item.moods
          ?.filter((m) => m.users.includes(currentUser._id))
          .map((m) => m.name) || []
    );
    setUserMoods(moods);
  }, [allUsersMoods, currentUser]);

  // Fetch items on load
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const sortByUpdatedAt = (data) =>
      data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if (token) {
      checkToken(token)
        .then((user) => {
          setIsLoggedIn(true);
          setCurrentUser(user);
          return getItems(token);
        })
        .then((res) => setAllUsersMoods(sortByUpdatedAt(res.data)))
        .catch(() => {
          setIsLoggedIn(false);
          setCurrentUser(null);
          localStorage.removeItem("jwt");
          getItems()
            .then((res) => setAllUsersMoods(sortByUpdatedAt(res.data)))
            .catch(console.error);
        });
    } else {
      getItems()
        .then((res) => setAllUsersMoods(sortByUpdatedAt(res.data)))
        .catch(console.error);
    }
  }, []);

  // Handlers
  const handleConfirmDelete = () => {
    const token = localStorage.getItem("jwt");
    const item = allUsersMoods.find((i) => i._id === pendingDeleteId);
    if (!item) return;

    const updatedMoods = item.moods.map((m) => ({
      ...m,
      users: m.users.filter((u) => u !== currentUser._id),
    }));
    const filteredMoods = updatedMoods.filter((m) => m.users.length > 0);

    if (filteredMoods.length === 0) {
      deleteItem(pendingDeleteId, token)
        .then(() => {
          setAllUsersMoods((prev) =>
            prev.filter((i) => i._id !== pendingDeleteId)
          );
          setPendingDeleteId(null);
          closeActiveModal();
        })
        .catch(console.error);
    } else {
      updateItemMoods(pendingDeleteId, filteredMoods, token)
        .then((res) => {
          setAllUsersMoods((prev) =>
            prev.map((i) => (i._id === res.data._id ? res.data : i))
          );
          setPendingDeleteId(null);
          closeActiveModal();
        })
        .catch(console.error);
    }
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

  const handleItemClick = (item) => {
    const fullItem =
      allUsersMoods.find((i) => i._id === item._id || i._id === item.id) ||
      item;
    setSelectedItem({ ...fullItem, _id: fullItem._id || item.id });
    setActiveModal("item");
  };

  const handleSave = (updatedItem) => {
    const token = localStorage.getItem("jwt");
    if (!updatedItem) return;

    const existingItem = allUsersMoods.find((i) => i._id === updatedItem._id);

    if (existingItem) {
      const moodsChanged =
        JSON.stringify(existingItem.moods) !==
        JSON.stringify(updatedItem.moods);
      if (!moodsChanged) {
        closeActiveModal();
        return;
      }
      updateItemMoods(updatedItem._id, updatedItem.moods, token)
        .then((res) => {
          setAllUsersMoods((prev) => [
            res.data,
            ...prev.filter((i) => i._id !== res.data._id),
          ]);
          closeActiveModal();
        })
        .catch(console.error);
    } else {
      const itemToSend = {
        _id: updatedItem._id || updatedItem.id,
        title: updatedItem.title,
        mediaType: updatedItem.mediaType,
        poster: updatedItem.poster,
        length: updatedItem.length,
        moods: updatedItem.moods.map((m) => ({
          name: m.name,
          users: m.users.map((u) => u.toString()),
        })),
      };
      addItem(itemToSend, token)
        .then((res) => {
          setAllUsersMoods((prev) => [res.data, ...prev]);
          closeActiveModal();
        })
        .catch(console.error);
    }
  };

  const handleProfileSubmit = (data) => {
    const token = localStorage.getItem("jwt");
    const payload = {};
    if (typeof data.name !== "undefined") payload.name = data.name;
    payload.avatarUrl = data.avatarUrl;

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

  const handleSignUp = ({ name, email, password }) => {
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    const defaultAvatarUrl = getAvatarUrl(randomSeed);
    signup({ name, email, password })
      .then(() =>
        handleLogIn({ email, password }).then((user) => {
          setCurrentUser({ ...user, avatarUrl: defaultAvatarUrl });
          return handleProfileSubmit({
            name,
            avatarUrl: defaultAvatarUrl,
          });
        })
      )
      .catch(console.error);
  };

  const handleLogIn = ({ email, password }) => {
    return login({ email, password }).then((res) => {
      localStorage.setItem("jwt", res.token);
      setIsLoggedIn(true);
      return Promise.all([checkToken(res.token), getItems(res.token)]).then(
        ([user, itemsRes]) => {
          setCurrentUser(user);
          setAllUsersMoods(itemsRes.data);
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
    <MoodsContext.Provider value={{ allUsersMoods, userMoods }}>
      <CurrentUserContext.Provider value={currentUser}>
        <>
          <Routes>
            <Route
              element={
                <Layout
                  onItemClick={handleItemClick}
                  resetAutocomplete={resetAutocomplete}
                  onSignUpClick={handleSignUpClick}
                  onLogInClick={handleLogInClick}
                  isLoggedIn={isLoggedIn}
                />
              }
            >
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
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/top-moods"
                element={
                  <TopMoods
                    onEditProfile={handleEditProfileClick}
                    userMoods={userMoods}
                  />
                }
              />
            </Route>
          </Routes>

          {/* Modals */}
          <RegisterModal
            onClose={closeActiveModal}
            isOpen={activeModal === "register"}
            onLogInClick={handleLogInClick}
            onSignUp={handleSignUp}
          />
          <LogInModal
            onClose={closeActiveModal}
            isOpen={activeModal === "log-in"}
            onSignUpClick={handleSignUpClick}
            onLogIn={handleLogIn}
          />
          <ItemModal
            item={selectedItem}
            isOpen={activeModal === "item"}
            onClose={closeActiveModal}
            onSave={handleSave}
            onDeleteRequest={handleConfirmClick}
            isLoggedIn={isLoggedIn}
            onSignUpClick={handleSignUpClick}
          />
          <ConfirmationModal
            isOpen={activeModal === "confirmation"}
            onClose={closeActiveModal}
            onConfirm={handleConfirmDelete}
          />
          <EditProfileModal
            isOpen={activeModal === "edit-profile"}
            onClose={handleCloseEditProfile}
            onSubmit={handleProfileSubmit}
            onOpenAvatarModal={handleEditAvatarClick}
            avatarUrl={pendingAvatarUrl || currentUser?.avatarUrl || ""}
            isLoggedIn={isLoggedIn}
          />
          <AvatarModal
            isOpen={subModal === "avatar"}
            onClose={handleCloseAvatarModal}
            isLoggedIn={isLoggedIn}
            onSave={handleAvatarSave}
          />
        </>
      </CurrentUserContext.Provider>
    </MoodsContext.Provider>
  );
}

export default App;
