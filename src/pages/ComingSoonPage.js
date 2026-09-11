// src/pages/ComingSoonPage.js — placeholder reutilizável pra features futuras (Meu Personal, Registros, etc)

import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './ComingSoonPage.css';

function ComingSoonPage({ icon: Icon, title, description }) {
  return (
    <div className="gg-soon-container">
      <div className="gg-soon-card">
        <div className="gg-soon-icon"><Icon /></div>
        <h1 className="gg-soon-title">{title}</h1>
        <p className="gg-soon-description">{description}</p>
        <span className="gg-soon-badge">Em breve</span>
        <Link to="/perfil" className="gg-soon-back">
          <FiArrowLeft /> Voltar pro Perfil
        </Link>
      </div>
    </div>
  );
}

export default ComingSoonPage;