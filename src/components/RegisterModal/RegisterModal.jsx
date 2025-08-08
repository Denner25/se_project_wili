import "./RegisterModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useEffect } from "react";
import useFormValidator from "../../hooks/useFormValidator";

function RegisterModal({
  onClose,
  onOverlayClose,
  onSignUp,
  isOpen,
  onLogInClick,
}) {
  const { values, errors, isValid, handleChange, resetForm } = useFormValidator(
    {
      name: "",
      avatar: "",
      email: "",
      password: "",
    }
  );

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onSignUp(values);
    }
  };

  return (
    <ModalWithForm
      title="Sign Up"
      buttonText="Sign Up"
      onClose={onClose}
      isOpen={isOpen}
      onOverlayClose={onOverlayClose}
      onSubmit={handleSubmit}
      isValid={isValid}
      secondaryButton={
        <button
          type="button"
          className="modal__secondary"
          onClick={onLogInClick}
        >
          or Sign In
        </button>
      }
    >
      <label className="modal__label">
        Email *
        <input
          type="email"
          className="modal__input"
          name="email"
          placeholder="Email"
          required
          value={values.email}
          onChange={handleChange}
        />
        <span className="modal__error">{errors.email}</span>
      </label>
      <label className="modal__label">
        Password *
        <input
          type="password"
          className="modal__input"
          name="password"
          placeholder="Password"
          minLength="6"
          required
          value={values.password}
          onChange={handleChange}
        />
        <span className="modal__error">{errors.password}</span>
      </label>
      <label className="modal__label">
        Name *
        <input
          type="text"
          className="modal__input"
          name="name"
          placeholder="Your name"
          minLength="2"
          maxLength="32"
          required
          value={values.name}
          onChange={handleChange}
        />
        <span className="modal__error">{errors.name}</span>
      </label>
      <label className="modal__label">
        Avatar URL*
        <input
          type="url"
          className="modal__input"
          name="avatar"
          placeholder="Avatar image URL"
          required
          value={values.avatar}
          onChange={handleChange}
        />
        <span className="modal__error">{errors.avatar}</span>
      </label>
    </ModalWithForm>
  );
}

export default RegisterModal;
