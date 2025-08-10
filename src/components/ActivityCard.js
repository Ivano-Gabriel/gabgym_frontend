// src/components/ActivityCard.js
import React from 'react';
import './ActivityCard.css';

// --- Sub-componentes internos para organizar o visual ---
const CardioDisplay = ({ atividade }) => (
  <>
    <div className="activity-icon cardio-icon">🏃‍♂️</div>
    <div className="activity-details">
      <strong>{atividade.tipo}</strong>
      <span>{atividade.duracao} min {atividade.distancia ? `- ${atividade.distancia} km` : ''}</span>
    </div>
  </>
);

const DietaDisplay = ({ atividade }) => (
  <>
    <div className="activity-icon dieta-icon">🥗</div>
    <div className="activity-details">
      <strong>Dieta Registrada</strong>
      <span>{atividade.calorias} kcal | {atividade.proteinas}g Prot.</span>
    </div>
  </>
);

const FotoDisplay = ({ atividade }) => (
  <>
    <div className="activity-icon foto-icon">📸</div>
    <div className="activity-details">
      <strong>Nova Foto de Evolução</strong>
      <span>{atividade.legenda || 'Foto adicionada'}</span>
    </div>
    <img src={atividade.url} alt="Evolução" className="activity-thumbnail" />
  </>
);
// ---------------------------------------------------------


const ActivityCard = ({ atividade, onCardClick }) => {
  
  // Função para formatar a data de forma amigável
  const formattedDate = new Date(atividade.data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Lógica para escolher qual visualização mostrar
  const renderContent = () => {
    switch (atividade.tipo) {
      case 'cardio':
        return <CardioDisplay atividade={atividade} />;
      case 'dieta':
        return <DietaDisplay atividade={atividade} />;
      case 'foto':
        return <FotoDisplay atividade={atividade} />;
      default:
        return <p>Atividade desconhecida</p>;
    }
  };

  return (
    // A MÁGICA ACONTECE AQUI: Adicionamos o onClick à div principal do card
    <div className="activity-card" onClick={() => onCardClick(atividade)}>
      <div className="activity-content">
        {renderContent()}
      </div>
      <div className="activity-date">{formattedDate}</div>
    </div>
  );
};

export default ActivityCard;