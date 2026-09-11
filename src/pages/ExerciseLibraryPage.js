// src/pages/ExerciseLibraryPage.js — container e abas com visual novo, Carousel mantido

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import { BODY_PART_MAP } from '../data/workoutDatabase';
import { getExercises } from '../services/apiService';
import { FiArrowLeft } from 'react-icons/fi';
import './ExerciseLibraryPage.css';

function ExerciseLibraryPage() {
  const [muscleGroupsData, setMuscleGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('superior');

  useEffect(() => {
    getExercises()
      .then(response => {
        const exercises = response.data;

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

  if (loading) {
    return (
      <div className="gg-exlib-container">
        <p className="gg-exlib-status">Carregando biblioteca...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="gg-exlib-container">
        <p className="gg-exlib-status error">Erro ao carregar: {error}</p>
      </div>
    );
  }

  return (
    <div className="gg-exlib-container">
      <div className="gg-exlib-top">
        <h1 className="gg-exlib-title">Biblioteca de Exercícios</h1>
        <p className="gg-exlib-subtitle">Navegue, aprenda a execução e monte seu próprio treino.</p>
      </div>

      <div className="gg-exlib-tabs">
        <button className={`gg-exlib-tab ${activeTab === 'superior' ? 'active' : ''}`} onClick={() => setActiveTab('superior')}>Membros Superiores</button>
        <button className={`gg-exlib-tab ${activeTab === 'inferior' ? 'active' : ''}`} onClick={() => setActiveTab('inferior')}>Membros Inferiores</button>
      </div>

      <div className="gg-exlib-carousels">
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

      <Link to="/training-models" className="gg-exlib-back"><FiArrowLeft /> Voltar</Link>
    </div>
  );
}

export default ExerciseLibraryPage;