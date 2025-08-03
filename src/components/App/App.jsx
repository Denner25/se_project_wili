import "./App.css";
import Header from "../Header/Header";
import ItemModal from "../ItemModal/ItemModal";
import { useState } from "react";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [savedItems, setSavedItems] = useState([]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setActiveModal("item");
  };

  const handleSave = (itemWithMoods) => {
    // If item already exists, update it; else add new
    setSavedItems((prev) => {
      const exists = prev.find((i) => i.id === itemWithMoods.id);
      if (exists) {
        return prev.map((i) => (i.id === itemWithMoods.id ? itemWithMoods : i));
      }
      return [...prev, itemWithMoods];
    });
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
        <Header onItemClick={handleItemClick} />
        <Main items={savedItems} onCardClick={handleItemClick} />
        <Footer />
      </div>

      {/* Global modal at top-level */}
      <ItemModal
        item={selectedItem}
        isOpen={activeModal === "item"}
        onOverlayClose={handleOverlayClose}
        onClose={closeActiveModal}
        onSave={handleSave}
      />
    </div>
  );
}

export default App;
