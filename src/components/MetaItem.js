// src/components/MetaItem.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import './MetaItem.css'; // Importando nosso novo CSS

const MetaItem = ({ meta, onConcluir, onRemover, isConcluida }) => {
  const { t } = useTranslation();

  return (
    <div className={`meta-item ${isConcluida ? 'concluida' : ''}`}>
      <p className="meta-texto">{meta.texto}</p>
      <div className="meta-actions">
        {isConcluida ? (
          <button className="action-button" title={t('goals.reactivateTitle', 'Reativar')} onClick={() => onConcluir(meta.id)}>↩️</button>
        ) : (
          <button className="action-button" title={t('goals.completeTitle', 'Concluir')} onClick={() => onConcluir(meta.id)}>✔️</button>
        )}
        <button className="action-button" title={t('goals.deleteTitle', 'Excluir')} onClick={() => onRemover(meta.id)}>❌</button>
      </div>
    </div>
  );
};

export default MetaItem;