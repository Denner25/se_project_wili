import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { BUTTONS } from "../../utils/constants";
import "./AvatarModal.css";

// List of seed names for avatars
export const seeds = [
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

// Helper to generate full avatar URL from seed
export const getAvatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;

function AvatarModal({ isOpen, onClose, onSave, onOverlayClose }) {
  const [selected, setSelected] = useState(seeds[0]); // default selection

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass full avatar URL to parent
    onSave(getAvatarUrl(selected));
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
          {BUTTONS.CANCEL}
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
            <img src={getAvatarUrl(seed)} alt={seed} width={64} height={64} />
          </div>
        ))}
      </div>
    </ModalWithForm>
  );
}

export default AvatarModal;
