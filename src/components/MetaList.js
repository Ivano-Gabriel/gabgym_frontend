// src/components/MetaList.js
import React from 'react';
import MetaItem from './MetaItem'; // Vamos importar o componente do item
import './MetaList.css'; // Crie este arquivo de CSS depois!

const MetaList = ({ title, metas, onConcluir, onRemover, emptyMessage, isConcluidaList = false }) => {
  return (
    <div className="meta-bloco">
      <h3 className="meta-bloco-title">{title}</h3>
      <div className="metas-list">
        {metas.length > 0 ? (
          metas.map(meta => (
            <MetaItem 
              key={meta.id}
              meta={meta}
              onConcluir={onConcluir}
              onRemover={onRemover}
              isConcluida={isConcluidaList}
            />
          ))
        ) : (
          <p className="empty-list-message">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
};

export default MetaList;