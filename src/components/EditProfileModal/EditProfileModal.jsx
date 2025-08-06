import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";

function EditProfileModal({
  isOpen,
  onClose,
  onOverlayClose,
  currentName,
  onSave,
}) {
  const [name, setName] = useState(currentName || "");

  // Keep state in sync with prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(currentName || "");
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
    onClose();
  };

  return (
    <ModalWithForm
      title="Edit Profile"
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClose={onOverlayClose}
      buttonText="Save"
      secondaryButtonText="Cancel"
      onSecondaryClick={onClose}
      onSubmit={handleSubmit}
    >
      <label className="modal__label">
        Name :
        <input
          type="text"
          className="modal__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </label>
    </ModalWithForm>
  );
}

export default EditProfileModal;
