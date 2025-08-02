import "./Modal.css";

function Modal({ isOpen, onClose, onOverlayClose, title, children }) {
  return (
    <div
      className={`modal${isOpen ? " modal_opened" : ""}`}
      onClick={onOverlayClose}
    >
      <div className="modal__content">
        <button
          onClick={onClose}
          type="button"
          className="modal__close"
        ></button>
        {title && <h2 className="modal__title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export default Modal;
