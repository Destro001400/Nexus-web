import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">Cancelar</button>
          <button onClick={onConfirm} className="confirm-btn">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
