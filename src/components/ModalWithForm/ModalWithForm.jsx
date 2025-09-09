import Modal from "../Modal/Modal";
import "./ModalWithForm.css";
import useModalClose from "../../hooks/useModalClose";

function ModalWithForm({
  children,
  buttonText,
  title,
  isOpen,
  onClose,
  onSubmit,
  secondaryButton,
}) {
  useModalClose(isOpen, onClose);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={onSubmit} className="modal__form">
        {children}
        <div className="modal__button-group">
          <button type="submit" className="modal__button">
            {buttonText}
          </button>
          {secondaryButton}
        </div>
      </form>
    </Modal>
  );
}

export default ModalWithForm;
