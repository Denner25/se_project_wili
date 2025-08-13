import "./EditProfileModal.css";
import { useContext, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { BUTTONS } from "../../utils/constants";
import useFormValidator from "../../hooks/useFormValidator";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function EditProfileModal({
  isOpen,
  onClose,
  onOverlayClose,
  onSubmit,
  avatarUrl,
  onOpenAvatarModal,
}) {
  const currentUser = useContext(CurrentUserContext);

  const { values, errors, isValid, handleChange, resetForm } = useFormValidator(
    {
      name: "",
    }
  );

  useEffect(() => {
    if (isOpen && currentUser) {
      resetForm({
        name: currentUser.name || "",
      });
    }
  }, [isOpen, currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSubmit(values);
    }
  };

  return (
    <ModalWithForm
      title="Edit Profile"
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClose={onOverlayClose}
      buttonText={BUTTONS.SAVE}
      secondaryButton={
        <button type="button" className="modal__secondary" onClick={onClose}>
          {BUTTONS.CANCEL}
        </button>
      }
      onSubmit={handleSubmit}
    >
      <label className="modal__label">
        Name :
        <input
          type="text"
          name="name"
          className="modal__input"
          placeholder="Enter your name"
          required
          value={values.name}
          onChange={handleChange}
        />
        <span className="modal__error">{errors.name}</span>
      </label>
      <label className="modal__label">
        Avatar:
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img
            src={avatarUrl}
            alt="Current Avatar"
            width={64}
            height={64}
            style={{ borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <button type="button" onClick={onOpenAvatarModal}>
            Change Avatar
          </button>
        </div>
      </label>
    </ModalWithForm>
  );
}

export default EditProfileModal;
