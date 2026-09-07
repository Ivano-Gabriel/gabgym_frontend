// src/components/ConfirmationModal.js
import React from 'react';

function ConfirmationModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="modal-button cancel">Cancelar</button>
          <button onClick={onConfirm} className="modal-button confirm">Confirmar</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;