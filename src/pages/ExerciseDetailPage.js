// src/pages/ExerciseDetailPage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MUSCLE_GROUP_WORKOUTS } from '../data/workoutDatabase';
import LazyLoadVideo from '../components/LazyLoadVideo';
import './ExerciseDetailPage.css';

// Função auxiliar para encontrar o exercício pelo ID que vem da URL
const findExerciseById = (id) => {
  for (const groupKey in MUSCLE_GROUP_WORKOUTS) {
    const group = MUSCLE_GROUP_WORKOUTS[groupKey];
    const foundExercise = group.exercises.find(ex => ex.name && ex.name.toLowerCase().replace(/\s/g, '-') === id);
    if (foundExercise) {
      return foundExercise;
    }
  }
  return null;
};

function ExerciseDetailPage() {
  const { exerciseId } = useParams(); // Pega o ID do exercício da URL
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
        <Link to="/exercise-library" className="back-button-general">Voltar para a Biblioteca</Link>
      </div>
    );
  }

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
        <Link to="/exercise-library" className="back-button-general">Voltar para a Biblioteca</Link>
      </div>
    </div>
  );
}

export default ExerciseDetailPage;