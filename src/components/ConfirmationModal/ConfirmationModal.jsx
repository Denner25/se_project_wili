import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { BUTTONS } from "../../utils/constants";

function ConfirmationModal({ isOpen, onClose, onOverlayClose, onConfirm }) {
  return (
    <ModalWithForm
      title="Delete this item from your profile and all moods you marked in it?"
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClose={onOverlayClose}
      buttonText={BUTTONS.DELETE}
      secondaryButtonText={BUTTONS.CANCEL}
      onSecondaryClick={onClose} // custom handler optional
      onSubmit={(e) => {
        e.preventDefault();
        onConfirm();
      }}
    ></ModalWithForm>
  );
}

export default ConfirmationModal;
