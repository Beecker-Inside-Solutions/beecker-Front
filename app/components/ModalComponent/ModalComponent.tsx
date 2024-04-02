import React, { useState, useEffect } from "react";
import styles from "./ModalComponent.module.css"; // Import CSS for modal styling

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  // Close modal function
  const closeModal = () => {
    setIsVisible(false);
    onClose();
  };

  // Render modal if isVisible is true
  return (
    isVisible && (
      <div className={styles.modalOverlay}>
        <button className={styles.closeButton} onClick={closeModal}>
          &times;
        </button>
        <div className={styles.modal}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    )
  );
};

export default Modal;
