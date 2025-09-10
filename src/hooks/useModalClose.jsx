import { useEffect } from "react";

function useModalClose(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return; // only active when modal is open

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    // Close on overlay click
    const handleOverlay = (e) => {
      if (e.target.classList.contains("modal")) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOverlay);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOverlay);
    };
  }, [isOpen, onClose]);
}

export default useModalClose;
