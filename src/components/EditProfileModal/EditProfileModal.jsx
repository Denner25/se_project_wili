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
      avatarUrl: "",
    }
  );

  useEffect(() => {
    if (isOpen && currentUser) {
      // Reset form with current user's name
      resetForm({
        name: currentUser.name || "",
      });
    }
    // Only run when modal opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      // Send the form data including avatarUrl from App's pendingAvatarUrl
      onSubmit({ ...values, avatarUrl });
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
      <label className="modal__label_avatar">
        Avatar:
        <div className="modal__avatar-row">
          <img
            src={avatarUrl}
            alt="Current Avatar"
            className="modal__avatar-img"
            width={64}
            height={64}
          />
          <input
            type="hidden"
            name="avatarUrl"
            value={values.avatarUrl ?? ""}
            required
            readOnly
          />
          <button
            className="modal__button_avatar-edit"
            type="button"
            onClick={onOpenAvatarModal}
          ></button>
        </div>
      </label>
      <label className="modal__label">
        Name :
        <input
          type="text"
          name="name"
          className="modal__input"
          placeholder="Enter your name"
          required
          value={values.name ?? ""}
          onChange={handleChange}
        />
        <span className="modal__error">{errors.name}</span>
      </label>
    </ModalWithForm>
  );
}

export default EditProfileModal;
