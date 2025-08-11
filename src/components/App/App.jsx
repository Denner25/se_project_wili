import "./App.css";
import Header from "../Header/Header";
import ItemModal from "../ItemModal/ItemModal";
import { useState } from "react";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Profile from "../Profile/Profile";
import { Routes, Route } from "react-router-dom";
import TopMoods from "../TopMoods/TopMoods";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [savedItems, setSavedItems] = useState([]);
  const [resetAutocomplete, setResetAutocomplete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [profileName, setProfileName] = useState("My Name");

  const handleConfirmClick = (id) => {
    setPendingDeleteId(id);
    setActiveModal("confirmation");
  };

  const handleConfirmDelete = () => {
    setSavedItems((prev) => prev.filter((item) => item.id !== pendingDeleteId));
    setPendingDeleteId(null);
    closeActiveModal();
  };

  const handleEditProfileClick = () => {
    setActiveModal("edit-profile");
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setActiveModal("item");
  };

  const handleSave = (itemWithMoods) => {
    setSavedItems((prev) => {
      if (!itemWithMoods.moods || itemWithMoods.moods.length === 0) {
        return prev.filter((i) => i.id !== itemWithMoods.id);
      }
      const exists = prev.find((i) => i.id === itemWithMoods.id);
      if (exists) {
        return prev.map((i) => (i.id === itemWithMoods.id ? itemWithMoods : i));
      }
      return [...prev, itemWithMoods];
    });
    setResetAutocomplete((f) => !f);
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  const handleOverlayClose = (e) => {
    if (e.target === e.currentTarget) {
      closeActiveModal();
    }
  };

  return (
    <div className="app">
      <div className="app__content">
        <Header
          onItemClick={handleItemClick}
          resetAutocomplete={resetAutocomplete}
          profileName={profileName}
        />
        <Routes>
          <Route
            path="/"
            element={<Main items={savedItems} onCardClick={handleItemClick} />}
          />
          <Route
            path="/profile"
            element={
              <Profile
                items={savedItems}
                onCardClick={handleItemClick}
                onDeleteRequest={handleConfirmClick}
                onEditProfile={handleEditProfileClick}
                profileName={profileName}
              />
            }
          />
          <Route
            path="/top-moods"
            element={
              <TopMoods
                savedItems={savedItems}
                onEditProfile={handleEditProfileClick}
                profileName={profileName}
              />
            }
          />
        </Routes>
        <Footer />
      </div>
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
        currentName={profileName}
        onSave={(newName) => setProfileName(newName)}
      />
    </div>
  );
}

export default App;
