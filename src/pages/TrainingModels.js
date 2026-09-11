// src/pages/TrainingModels.js — porta de entrada dos treinos, visual novo

import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiSettings, FiArrowLeft } from 'react-icons/fi';
import './TrainingModels.css';

function TrainingModels() {
  return (
    <div className="gg-tm-container">
      <div className="gg-tm-card">

        <div className="gg-tm-top">
          <h1 className="gg-tm-title">Central de Treinamento</h1>
          <p className="gg-tm-subtitle">O que você busca hoje? Conhecimento ou um plano pra seguir?</p>
        </div>

        <div className="gg-tm-portals">
          <Link to="/exercise-library" className="gg-tm-portal">
            <div className="gg-tm-portal-icon"><FiBookOpen /></div>
            <div className="gg-tm-portal-text">
              <h3>Explorar Exercícios</h3>
              <p>Navegue pela biblioteca de movimentos, veja vídeos e aprenda a execução correta.</p>
            </div>
          </Link>

          <Link to="/routine-generator" className="gg-tm-portal">
            <div className="gg-tm-portal-icon"><FiSettings /></div>
            <div className="gg-tm-portal-text">
              <h3>Gerar Rotina Semanal</h3>
              <p>Diga sua frequência e objetivo, e a gente monta um plano completo pra você seguir.</p>
            </div>
          </Link>
        </div>

        <Link to="/perfil" className="gg-tm-back"><FiArrowLeft /> Voltar pro Perfil</Link>
      </div>
    </div>
  );
}

export default TrainingModels;