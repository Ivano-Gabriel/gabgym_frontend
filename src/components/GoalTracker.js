// src/components/GoalTracker.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import './GoalTracker.css';

const GoalTracker = ({ metas }) => {
  const { t } = useTranslation();
  const metasEmAndamento = metas.filter(meta => !meta.concluida);

  return (
    <div className="goal-tracker-container">
      <h3 className="goal-tracker-title">{t('evolutionPanel.mainGoals', 'Metas Principais')}</h3>
      {metasEmAndamento.length > 0 ? (
        <div className="goals-list">
          {metasEmAndamento.slice(0, 2).map(meta => ( // Mostrando apenas as 2 primeiras
            <div key={meta.id} className="goal-item">
              <span className="goal-icon">🎯</span>
              <p className="goal-text">{meta.texto}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-goals-message">{t('evolutionPanel.noGoals', 'Defina uma meta de longo prazo!')}</p>
      )}
    </div>
  );
};

export default GoalTracker;