// src/pages/RoutineGeneratorPage.js — visual novo, mesma lógica de sempre

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { trainingPlans } from '../data/trainingPlans';
import { FiArrowLeft } from 'react-icons/fi';
import './RoutineGeneratorPage.css';

function RoutineGeneratorPage() {
  const navigate = useNavigate();
  const [gender, setGender] = useState('male');

  const handleSelectPlan = (plan) => {
    navigate(`/plano-de-treino/${plan.id}`, { state: { weeklyPlan: plan } });
  };

  const filteredPlans = trainingPlans[gender];

  return (
    <div className="gg-rg-container">
      <div className="gg-rg-card">

        <div className="gg-rg-top">
          <h1 className="gg-rg-title">Gerador de Rotinas</h1>
          <p className="gg-rg-subtitle">Escolha o modelo que melhor se adapta à sua rotina e objetivo.</p>
        </div>

        <div className="gg-rg-gender-toggle">
          <button className={`gg-rg-gender-btn ${gender === 'male' ? 'active' : ''}`} onClick={() => setGender('male')}>
            Para Ele
          </button>
          <button className={`gg-rg-gender-btn ${gender === 'female' ? 'active' : ''}`} onClick={() => setGender('female')}>
            Para Ela
          </button>
        </div>

        <div className="gg-rg-grid">
          {filteredPlans.map(plan => (
            <div key={plan.id} className="gg-rg-plan-card" onClick={() => handleSelectPlan(plan)}>
              <img src={plan.image} alt={plan.title} className="gg-rg-plan-image" />
              <div className="gg-rg-plan-overlay">
                <h3>{plan.title}</h3>
                <p>{plan.shortDesc}</p>
                <span className="gg-rg-plan-cta">Ver Plano Completo →</span>
              </div>
            </div>
          ))}
        </div>

        <Link to="/training-models" className="gg-rg-back"><FiArrowLeft /> Voltar</Link>
      </div>
    </div>
  );
}

export default RoutineGeneratorPage;