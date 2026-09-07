// src/components/ActivityDetailModal.js
import React from 'react';
import Modal from './Modal'; // Usando o seu componente genérico de Modal que já existe!

const ActivityDetailModal = ({ atividade, onClose }) => {
  if (!atividade) return null;

  const renderDetails = () => {
    switch (atividade.tipo) {
      case 'cardio':
        return (
          <>
            <p><strong>Duração:</strong> {atividade.duracao} minutos</p>
            {atividade.distancia && <p><strong>Distância:</strong> {atividade.distancia} km</p>}
          </>
        );
      case 'dieta':
        return (
          <>
            <p><strong>Calorias:</strong> {atividade.calorias} kcal</p>
            <p><strong>Proteínas:</strong> {atividade.proteinas}g</p>
            {/* Adicione outros macros se quiser */}
          </>
        );
      case 'foto':
        return (
          <>
            <img src={atividade.url} alt={atividade.legenda || 'Foto de Evolução'} style={{ maxWidth: '100%', borderRadius: '8px' }}/>
            {atividade.legenda && <p style={{ marginTop: '10px' }}><strong>Legenda:</strong> {atividade.legenda}</p>}
          </>
        );
      default:
        return <p>Detalhes não disponíveis.</p>;
    }
  };

  return (
    <Modal 
      isOpen={!!atividade} 
      onClose={onClose} 
      title={`Detalhes de: ${atividade.tipo.charAt(0).toUpperCase() + atividade.tipo.slice(1)}`}
    >
      <div className="activity-detail-content">
        <p><strong>Data:</strong> {new Date(atividade.data).toLocaleDateString('pt-BR')}</p>
        {renderDetails()}
      </div>
    </Modal>
  );
};

export default ActivityDetailModal;