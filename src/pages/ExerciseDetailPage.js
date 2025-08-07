// src/pages/ExerciseDetailPage.js (Versão Final Refatorada)

import React from 'react';
import { useParams, Link } from 'react-router-dom';
// 1. A TROCA DE INTELIGÊNCIA: Importamos nossa nova e única fonte da verdade!
import { EXERCISE_LIBRARY } from '../data/workoutDatabase';
import LazyLoadVideo from '../components/LazyLoadVideo';
import './ExerciseDetailPage.css';

// 2. A BUSCA A LASER: Nossa função de busca ficou 1000x mais simples e rápida!
// Em vez de procurar em vários lugares, agora a gente só pega o exercício pelo seu ID direto na nossa "enciclopédia".
const findExerciseById = (id) => {
  return EXERCISE_LIBRARY[id] || null; // Retorna o exercício se o ID existir, senão retorna nulo.
};

function ExerciseDetailPage() {
  const { exerciseId } = useParams(); // Pega o ID do exercício da URL (ex: 'supino-reto-halter')
  const exercise = findExerciseById(exerciseId);

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('/images/detail-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  if (!exercise) {
    return (
      <div className="content-page" style={pageStyle}>
        <h2 className="workout-page-title">Exercício não encontrado</h2>
        <p>O exercício que você procurou não existe na nossa base de dados.</p>
        <Link to="/exercise-library" className="back-button-general">Voltar para a Biblioteca</Link>
      </div>
    );
  }

  // O resto do seu código já era perfeito e não precisa mudar nada!
  return (
    <div className="content-page" style={pageStyle}>
      <div className="exercise-detail-container">
        <h2 className="exercise-detail-title">{exercise.name}</h2>
        <div className="exercise-detail-video">
          <LazyLoadVideo src={exercise.localVideo} />
        </div>
        <div className="exercise-detail-description">
          <h3>Como Executar:</h3>
          <p>{exercise.description}</p>
        </div>
        {/*
          Aqui no futuro a gente pode adicionar mais detalhes da EXERCISE_LIBRARY,
          como o muscleGroup, etc.
        */}
        <Link to="/exercise-library" className="back-button-general">Voltar para a Biblioteca</Link>
      </div>
    </div>
  );
}

export default ExerciseDetailPage;