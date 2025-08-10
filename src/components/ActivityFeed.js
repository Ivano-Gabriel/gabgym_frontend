// src/components/ActivityFeed.js - VERSÃO CORRIGIDA
import React from 'react';
import ActivityCard from './ActivityCard';
import './ActivityFeed.css';

const ActivityFeed = ({ atividades, onCardClick }) => {
  // A mágica acontece aqui: ordenando todas as atividades pela data, da mais recente para a mais antiga.
  const sortedAtividades = atividades.sort((a, b) => new Date(b.data) - new Date(a.data));

  return (
    <div className="activity-feed-container">
       <h3 className="activity-feed-title">Seu Histórico Recente</h3>
      <div className="activity-list">
        {sortedAtividades.map(atividade => (
          <ActivityCard 
            key={atividade.id} 
            atividade={atividade} 
            onCardClick={onCardClick} 
          /> // <-- O PARAFUSO APERTADO! A tag foi fechada aqui.
        ))}
      </div> {/* <-- O fechamento da div da lista */}
    </div> /* <-- O fechamento da div principal */
  );
};

export default ActivityFeed;