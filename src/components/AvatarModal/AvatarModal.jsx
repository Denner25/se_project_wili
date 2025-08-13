import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./AvatarModal.css";

// Neutral seeds for avatars
const seeds = [
  "pebble",
  "breeze",
  "ember",
  "petal",
  "dawn",
  "dusk",
  "echo",
  "frost",
  "glow",
  "haze",
  "drift",
  "grove",
  "quartz",
  "sprout",
  "shade",
  "tide",
];
const style = "bottts"; // DiceBear style

function AvatarModal({ isOpen, onClose, onSave, onOverlayClose }) {
  const [selected, setSelected] = useState(seeds[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the full avatar URL to App.js
    onSave(`https://api.dicebear.com/7.x/${style}/svg?seed=${selected}`);
  };

  return (
    <ModalWithForm
      title="Pick Your Avatar:"
      isOpen={isOpen}
      onOverlayClose={onOverlayClose}
      onClose={onClose}
      buttonText="Save"
      onSubmit={handleSubmit}
      secondaryButton={
        <button className="modal__secondary" type="button" onClick={onClose}>
          Cancel
        </button>
      }
    >
      <div className="modal__avatar-grid">
        {seeds.map((seed) => (
          <div
            key={seed}
            className={`modal__avatar-option${
              selected === seed ? " modal__avatar-option_selected" : ""
            }`}
            onClick={() => setSelected(seed)}
          >
            <img
              src={`https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`}
              alt={seed}
              width={64}
              height={64}
            />
          </div>
        ))}
      </div>
    </ModalWithForm>
  );
}

export default AvatarModal;
