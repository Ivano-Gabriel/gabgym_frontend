// src/pages/CardioPage.js (O Novo Hub)
import React from 'react';
import { Link } from 'react-router-dom';

function CardioPage() {
  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/images/run.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">Central de Cardio</h2>
      <p className="content-description">O que você deseja fazer hoje?</p>
      <div className="hub-actions-container">
        <Link to="/cardio/select" className="hub-action-button">
          <span className="hub-action-icon">▶️</span>
          <h3>Iniciar Nova Atividade</h3>
          <p>Cronometre sua corrida, pedalada, ou outra atividade física.</p>
        </Link>
        <Link to="#" className="hub-action-button disabled">
          <span className="hub-action-icon">📊</span>
          <h3>Meu Histórico</h3>
          <p>Veja seus recordes e atividades passadas. (Em breve!)</p>
        </Link>
      </div>
       <Link to="/perfil" className="back-button-general">Voltar para o Hub</Link>
    </div>
  );
}

export default CardioPage;
