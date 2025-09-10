import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { BUTTONS } from "../../utils/constants";

function ConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <ModalWithForm
      title="Delete this item from your profile and all moods you marked in it?"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={BUTTONS.DELETE}
      secondaryButton={
        <button type="button" className="modal__secondary" onClick={onClose}>
          {BUTTONS.CANCEL}
        </button>
      }
      onSubmit={(e) => {
        e.preventDefault();
        onConfirm();
      }}
    ></ModalWithForm>
  );
}

export default ConfirmationModal;
