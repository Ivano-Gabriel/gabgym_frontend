// src/pages/CardioPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { BsPlayCircle, BsListCheck } from 'react-icons/bs'; // Ícones para Cardio
import './CardioPage.css'; // Usaremos um CSS próprio

function CardioPage() {
  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('/images/gi.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <div className="content-page cardio-hub-container" style={pageStyle}>
      <h2 className="workout-page-title">Sessão de Cardio</h2>
      <p className="content-description">Monitore suas corridas ou registre outras atividades físicas.</p>
      
      <div className="hub-portals-container">
        
        <Link to="/cardio/start" className="portal-card">
          <BsPlayCircle className="portal-icon" />
          <div className="portal-text-content">
            <h3>Iniciar Corrida/Caminhada</h3>
            <p>Use o GPS para rastrear sua atividade em tempo real, vendo distância, ritmo e calorias.</p>
          </div>
        </Link>
        
        <Link to="/cardio/select" className="portal-card">
          <BsListCheck className="portal-icon" />
          <div className="portal-text-content">
            <h3>Registrar Outra Atividade</h3>
            <p>Fez natação, bike ou outro esporte? Adicione manualmente ao seu diário de gastos calóricos.</p>
          </div>
        </Link>

      </div>
    </div>
  );
}

export default CardioPage;