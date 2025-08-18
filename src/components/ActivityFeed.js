// src/components/ActivityFeed.js
import React from 'react';
import ActivityCard from './ActivityCard';
import './ActivityFeed.css';

const ActivityFeed = ({ atividades, onCardClick }) => {
  // Garante que atividades seja um array antes de tentar ordenar
  const sortedAtividades = Array.isArray(atividades) 
    ? [...atividades].sort((a, b) => new Date(b.data) - new Date(a.data))
    : [];

  return (
    <div className="activity-feed-container">
       <h3 className="activity-feed-title">Seu Histórico Recente</h3>
       {sortedAtividades.length > 0 ? (
         <div className="activity-list">
           {sortedAtividades.map(atividade => (
             <ActivityCard 
               key={atividade.id} 
               atividade={atividade} 
               onCardClick={onCardClick}
             />
           ))}
         </div>
       ) : (
         <p className="status-message">Nenhuma atividade encontrada no seu histórico.</p>
       )}
    </div>
  );
};

export default ActivityFeed;