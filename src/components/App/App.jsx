import "./App.css";
import Header from "../Header/Header";
import ItemModal from "../ItemModal/ItemModal";
import { useState } from "react";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Profile from "../Profile/Profile";
import { Routes, Route } from "react-router-dom";
import TopMoods from "../TopMoods/TopMoods";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [savedItems, setSavedItems] = useState([]);
  const [resetAutocomplete, setResetAutocomplete] = useState(false);
  // const [items, setItems] = useState([]);
  // const [query, setQuery] = useState("");

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setActiveModal("item");
  };

  // const resetAutocomplete = () => {
  //   setQuery("");
  // };

  const handleSave = (itemWithMoods) => {
    // If item already exists, update it; else add new
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
    // resetAutocomplete();
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

  const handleDelete = (itemId) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <div className="app">
      <div className="app__content">
        <Header
          onItemClick={handleItemClick}
          resetAutocomplete={resetAutocomplete}
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
                onDelete={handleDelete}
              />
            }
          />
          <Route
            path="/top-moods"
            element={<TopMoods savedItems={savedItems} />}
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
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
