// src/pages/ExerciseLibraryPage.js (Versão conectada ao backend Java)

import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import { BODY_PART_MAP } from '../data/workoutDatabase';
import FloatingBackButton from '../components/FloatingBackButton';
import { getExercises } from '../services/apiService';
import './ExerciseLibraryPage.css';

function ExerciseLibraryPage() {
  const [muscleGroupsData, setMuscleGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('superior');

  useEffect(() => {
    getExercises()
      .then(response => {
        const exercises = response.data; // lista plana, cada exercício com "muscleGroup" dentro

        // Agrupa os exercícios por grupo muscular (o backend Java não manda isso aninhado)
        const gruposMap = new Map();
        exercises.forEach(ex => {
          const groupId = ex.muscleGroup.id;
          if (!gruposMap.has(groupId)) {
            gruposMap.set(groupId, {
              id: groupId,
              name: ex.muscleGroup.name,
              exercises: [],
            });
          }
          gruposMap.get(groupId).exercises.push(ex);
        });

        setMuscleGroupsData(Array.from(gruposMap.values()));
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar dados:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getVisibleGroups = () => {
    const visibleGroupNames = BODY_PART_MAP[activeTab];
    return muscleGroupsData.filter(group => visibleGroupNames.includes(group.name));
  };

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('/images/run.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  if (loading) {
    return <div className="content-page" style={pageStyle}><h2 className="workout-page-title">Carregando Biblioteca...</h2></div>;
  }
  if (error) {
    return <div className="content-page" style={pageStyle}><h2 className="workout-page-title" style={{ color: 'red' }}>Erro: {error}</h2></div>;
  }

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">Biblioteca de Exercícios</h2>
      <p className="content-description">Navegue, aprenda a execução e monte seu próprio treino.</p>

      <div className="tabs-container">
        <button className={`tab-button ${activeTab === 'superior' ? 'active' : ''}`} onClick={() => setActiveTab('superior')}>Membros Superiores</button>
        <button className={`tab-button ${activeTab === 'inferior' ? 'active' : ''}`} onClick={() => setActiveTab('inferior')}>Membros Inferiores</button>
      </div>

      <div className="carousels-container">
        {getVisibleGroups().map(group => (
          <Carousel
            key={group.id}
            title={group.name}
            items={group.exercises.map(exercise => ({
              id: exercise.id,
              title: exercise.name,
              imageSrc: exercise.imagePath,
              link: `/exercicio/${exercise.id}`,
            }))}
          />
        ))}
      </div>
      <FloatingBackButton to="/central-treino" />
    </div>
  );
}

export default ExerciseLibraryPage;