import "./LogInModal.css";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useEffect, useState } from "react";
import useFormValidator from "../../hooks/useFormValidator";

function LogInModal({
  onClose,
  onOverlayClose,
  onLogIn,
  isOpen,
  onSignUpClick,
}) {
  const { values, errors, isValid, handleChange, resetForm } = useFormValidator(
    {
      email: "",
      password: "",
    }
  );
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    resetForm();
    setServerError("");
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogIn(values).catch((err) => {
      console.error(err);
      setServerError("Email or password incorrect");
    });
  };

  return (
    <ModalWithForm
      title="Log In"
      buttonText="Log In"
      onClose={onClose}
      isOpen={isOpen}
      onOverlayClose={onOverlayClose}
      onSubmit={handleSubmit}
      isValid={isValid}
      secondaryButton={
        <button
          type="button"
          className="modal__secondary"
          onClick={onSignUpClick}
        >
          or Sign Up
        </button>
      }
    >
      <label className="modal__label">
        Email
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
        Password
        <input
          type="password"
          className="modal__input"
          name="password"
          placeholder="Password"
          minLength={6}
          required
          value={values.password}
          onChange={handleChange}
        />
        <span className="modal__error">{errors.password}</span>
      </label>
      {serverError && (
        <span className="modal__error modal__error_server">{serverError}</span>
      )}
    </ModalWithForm>
  );
}

export default LogInModal;
