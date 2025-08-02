import "./App.css";
import Header from "../Header/Header";
import ItemModal from "../ItemModal/ItemModal";
import { useState } from "react";

function App() {
  const [activeModal, setActiveModal] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setActiveModal("item");
  };

  const handleSave = (data) => {
    console.log("Saved item with moods:", data);
    closeActiveModal();
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
