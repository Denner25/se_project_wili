import { useState } from "react";

export default function useModals() {
  const [activeModal, setActiveModal] = useState("");
  const [subModal, setSubModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingAvatarUrl, setPendingAvatarUrl] = useState("");

  const openModal = (name) => setActiveModal(name);
  const closeModal = () => {
    setActiveModal("");
    setSelectedItem(null);
    setPendingDeleteId(null);
  };

  const openSubModal = (name) => setSubModal(name);
  const closeSubModal = () => setSubModal(null);

  return {
    activeModal,
    openModal,
    closeModal,
    subModal,
    openSubModal,
    closeSubModal,
    selectedItem,
    setSelectedItem,
    pendingDeleteId,
    setPendingDeleteId,
    pendingAvatarUrl,
    setPendingAvatarUrl,
  };
}
