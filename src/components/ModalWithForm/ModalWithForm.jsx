import Modal from "../Modal/Modal";
import "./ModalWithForm.css";

function ModalWithForm({
  children,
  buttonText,
  title,
  isOpen,
  onClose,
  onOverlayClose,
  onSubmit,
  secondaryButton,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClose={onOverlayClose}
      title={title}
    >
      <form onSubmit={onSubmit} className="modal__form">
        {children}
        <div className="modal__button-group">
          <button type="submit" className="modal__submit">
            {buttonText}
          </button>
          {secondaryButton}
        </div>
      </form>
    </Modal>
  );
}

export default ModalWithForm;
