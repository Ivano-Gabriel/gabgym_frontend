// src/pages/TrainingPlanPage.js — visual novo, mesma lógica de sempre

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { EXERCISE_LIBRARY } from '../data/workoutDatabase';
import { FiArrowLeft, FiMoon } from 'react-icons/fi';
import './TrainingPlanPage.css';

function TrainingPlanPage() {
  const location = useLocation();
  const { weeklyPlan } = location.state || {};

  if (!weeklyPlan || !weeklyPlan.schedule) {
    return (
      <div className="gg-tp-container">
        <div className="gg-tp-empty">
          <p>Nenhum plano de treino foi encontrado.</p>
          <Link to="/routine-generator" className="gg-tp-back-btn">Voltar</Link>
        </div>
      </div>
    );
  }

  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  return (
    <div className="gg-tp-container">
      <div className="gg-tp-card">

        <div className="gg-tp-top">
          <h1 className="gg-tp-title">{weeklyPlan.title}</h1>
          <p className="gg-tp-subtitle">{weeklyPlan.shortDesc}</p>
        </div>

        <div className="gg-tp-days">
          {weeklyPlan.schedule.map((dayPlan, index) => {
            if (dayPlan.type === 'rest') {
              return (
                <div key={index} className="gg-tp-day-card rest">
                  <span className="gg-tp-day-name">{weekDays[index]}</span>
                  <h3><FiMoon /> {dayPlan.title}</h3>
                  <p className="gg-tp-rest-text">Recuperação é parte do treino!</p>
                </div>
              );
            }

            return (
              <div key={index} className="gg-tp-day-card">
                <span className="gg-tp-day-name">{weekDays[index]}</span>
                <h3>{dayPlan.title}</h3>

                <ul className="gg-tp-exercise-list">
                  {dayPlan.plan.map((exerciseRef, exIndex) => {
                    const exercise = EXERCISE_LIBRARY[exerciseRef.exerciseId];
                    if (!exercise) return null;

                    return (
                      <li key={exIndex} className="gg-tp-exercise-item">
                        <Link to={`/exercicio/${exercise.id}`} className="gg-tp-exercise-name">
                          {exercise.name}
                        </Link>
                        <span className="gg-tp-exercise-sets">
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

        <Link to="/routine-generator" className="gg-tp-back"><FiArrowLeft /> Voltar pra Seleção</Link>
      </div>
    </div>
  );
}

export default TrainingPlanPage;