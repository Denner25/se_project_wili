import "./Modal.css";

function Modal({ isOpen, onClose, title, children }) {
  return (
    <div className={`modal${isOpen ? " modal_opened" : ""}`}>
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
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
