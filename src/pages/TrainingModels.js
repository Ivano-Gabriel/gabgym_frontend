// src/pages/TrainingModels.js
import React from 'react';
import { Link } from 'react-router-dom';
// 1. IMPORTANDO OS ÍCONES QUE VAMOS USAR
import { BsBook, BsGear } from 'react-icons/bs'; 
import './TrainingModels.css';

function TrainingModels() {
  const pageStyle = {
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
        
        {/* CARD 1: AGORA COM O ÍCONE BSBOOK */}
        <Link to="/exercise-library" className="portal-card">
          <BsBook className="portal-icon" />
          <div className="portal-text-content">
            <h3>Explorar Exercícios</h3>
            <p>Navegue por nossa biblioteca de movimentos, veja vídeos e aprenda a execução correta.</p>
          </div>
        </Link>
        
        {/* CARD 2: AGORA COM O ÍCONE BSGEAR */}
        <Link to="/routine-generator" className="portal-card">
          <BsGear className="portal-icon" />
          <div className="portal-text-content">
            <h3>Gerar Rotina Semanal</h3>
            <p>Nos diga sua frequência e gênero, e nós montaremos um plano completo para você seguir.</p>
          </div>
        </Link>

      </div>

      <Link to="/perfil" className="back-button-general">
        Voltar para o Perfil
      </Link>

    </div>
  );
}

export default TrainingModels;