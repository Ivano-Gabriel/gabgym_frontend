// src/pages/TrainingPlanPage.js
import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './TrainingPlanPage.css';

function TrainingPlanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { weeklyPlan } = location.state || {};

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

  const handleWorkoutClick = (workout) => {
    // Criamos um ID a partir do título para a URL
    const workoutId = workout.title.toLowerCase().replace(/ & /g, '-').replace(/\s/g, '-');
    navigate(`/exercicios/${workoutId}`, { state: { workoutData: workout } });
  };

  const weekDays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">{weeklyPlan.title}</h2>
      <p className="content-description" style={{maxWidth: '800px', margin: '0 auto 40px auto', textAlign: 'center'}}>
        {weeklyPlan.shortDesc}
      </p>
      
      <div className="weekly-plan-container">
        {weeklyPlan.schedule.map((dayPlan, index) => {
          // Se for um dia de descanso
          if (dayPlan.type === 'rest') {
            return (
              <div key={index} className="day-card rest-day-card">
                <span className="day-name">{weekDays[index]}</span>
                <h3 className="day-workout-title">{dayPlan.title}</h3>
                <p className="rest-day-text">Recuperação é parte do treino!</p>
              </div>
            );
          }
          // Se for um dia de treino normal
          return (
            <div key={index} className="day-card">
              <span className="day-name">{weekDays[index]}</span>
              <h3 className="day-workout-title">{dayPlan.title}</h3>
              <button onClick={() => handleWorkoutClick(dayPlan)} className="view-workout-button">
                Ver Treino do Dia
              </button>
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