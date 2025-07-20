// src/pages/TrainingModels.js
import React from 'react';
import { Link } from 'react-router-dom';
import './TrainingModels.css';

function TrainingModels() {
  const pageStyle = {
    // Usando o background que você lembrou!
    backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/images/run.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <div className="content-page training-hub-container" style={pageStyle}>
      <h2 className="workout-page-title">Central de Treinamento</h2>
      <p className="content-description">O que você busca hoje? Conhecimento ou um plano para seguir?</p>
      
      <div className="hub-portals-container">
        {/* Este link levará para a futura página da Biblioteca de Exercícios */}
        <Link to="/exercise-library" className="portal-card">
          <div className="portal-icon">📚</div>
          <h3>Explorar Exercícios</h3>
          <p>Navegue por nossa biblioteca de movimentos, veja vídeos e aprenda a execução correta.</p>
        </Link>
        
        {/* Este link levará para a futura página do Gerador de Rotinas */}
        <Link to="/routine-generator" className="portal-card">
          <div className="portal-icon">⚙️</div>
          <h3>Gerar Rotina Semanal</h3>
          <p>Nos diga sua frequência e gênero, e nós montaremos um plano completo para você seguir.</p>
        </Link>
      </div>
    </div>
  );
}

export default TrainingModels;