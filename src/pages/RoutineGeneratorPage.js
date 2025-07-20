// src/pages/RoutineGeneratorPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainingPlans } from '../data/trainingPlans'; // Importando nossos planos de treino
import './RoutineGeneratorPage.css';

function RoutineGeneratorPage() {
  const navigate = useNavigate();
  const [gender, setGender] = useState('male'); // 'male' ou 'female'

  const handleSelectPlan = (plan) => {
    // Navega para a página que mostra o plano detalhado, passando os dados
    navigate(`/plano-de-treino/${plan.id}`, { state: { weeklyPlan: plan } });
  };

  // Filtra os planos baseados no gênero selecionado
  const filteredPlans = trainingPlans[gender];

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/images/run.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">Gerador de Rotinas</h2>
      <p className="content-description">Escolha o modelo que melhor se adapta à sua rotina e objetivo.</p>

      <div className="gender-selector">
        <button 
          className={`gender-button ${gender === 'male' ? 'active' : ''}`}
          onClick={() => setGender('male')}
        >
          Para Ele
        </button>
        <button 
          className={`gender-button ${gender === 'female' ? 'active' : ''}`}
          onClick={() => setGender('female')}
        >
          Para Ela
        </button>
      </div>

      <div className="training-plan-grid">
        {filteredPlans.map(plan => (
          <div key={plan.id} className="plan-card" onClick={() => handleSelectPlan(plan)}>
            <img src={plan.image} alt={plan.title} className="plan-card-image" />
            <div className="plan-card-overlay">
              <h3 className="plan-card-title">{plan.title}</h3>
              <p className="plan-card-description">{plan.shortDesc}</p>
              <span className="plan-card-cta">Ver Plano Completo</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoutineGeneratorPage;