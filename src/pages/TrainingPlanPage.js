// src/pages/TrainingPlanPage.js (Versão Final "Bestaferamente Clean")

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
// 1. IMPORTAMOS A ENCICLOPÉDIA! Agora esta página tem acesso a todos os detalhes dos exercícios.
import { EXERCISE_LIBRARY } from '../data/workoutDatabase'; 
import './TrainingPlanPage.css';

function TrainingPlanPage() {
  const location = useLocation();
  const { weeklyPlan } = location.state || {}; // Os dados do plano vêm da página anterior

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/ee.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  if (!weeklyPlan || !weeklyPlan.schedule) {
    return (
      <div className="content-page" style={pageStyle}>
        <h2 className="workout-page-title">Erro</h2>
        <p className="content-description">Nenhum plano de treino foi encontrado.</p>
        <Link to="/routine-generator" className="back-button-general">Voltar</Link>
      </div>
    );
  }

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">{weeklyPlan.title}</h2>
      <p className="content-description" style={{maxWidth: '800px', margin: '0 auto 40px auto', textAlign: 'center'}}>
        {weeklyPlan.shortDesc}
      </p>
      
      <div className="weekly-plan-container">
        {weeklyPlan.schedule.map((dayPlan, index) => {
          // Se for um dia de descanso, continua igual
          if (dayPlan.type === 'rest') {
            return (
              <div key={index} className="day-card rest-day-card">
                <span className="day-name">{weekDays[index]}</span>
                <h3 className="day-workout-title">{dayPlan.title}</h3>
                <p className="rest-day-text">Recuperação é parte do treino!</p>
              </div>
            );
          }

          // 2. A MÁGICA ACONTECE AQUI! Se for dia de treino...
          return (
            <div key={index} className="day-card">
              <span className="day-name">{weekDays[index]}</span>
              <h3 className="day-workout-title">{dayPlan.title}</h3>
              
              {/* Criamos a lista de exercícios do dia AQUI MESMO */}
              <ul className="daily-exercise-list">
                {dayPlan.plan.map((exerciseRef, exIndex) => {
                  // Para cada ID de exercício no plano, buscamos os detalhes na nossa enciclopédia
                  const exercise = EXERCISE_LIBRARY[exerciseRef.exerciseId];
                  
                  // Se, por algum motivo, o exercício não for encontrado, não quebra a página
                  if (!exercise) return null; 

                  return (
                    <li key={exIndex} className="daily-exercise-item">
                      {/* O nome do exercício agora é um link para a página de detalhes que JÁ FUNCIONA! */}
                      <Link to={`/exercicio/${exercise.id}`} className="exercise-name-link">
                        {exercise.name}
                      </Link>
                      <span className="exercise-sets-reps">
                        {exerciseRef.sets}x {exerciseRef.reps} {exerciseRef.note && `(${exerciseRef.note})`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <Link to="/routine-generator" className="back-button-general">
        Voltar para Seleção
      </Link>
    </div>
  );
}

export default TrainingPlanPage;