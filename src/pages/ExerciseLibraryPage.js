// src/pages/ExerciseLibraryPage.js (Versão Final Corrigida)

import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
// Importamos nossa nova "cola"
import { BODY_PART_MAP } from '../data/workoutDatabase'; 
import FloatingBackButton from '../components/FloatingBackButton';
import './ExerciseLibraryPage.css';

function ExerciseLibraryPage() {
  const [muscleGroupsData, setMuscleGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('superior');

  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/api/muscle-groups/';

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Não foi possível conectar à API. O servidor Django está rodando?');
        }
        return response.json();
      })
      .then(data => {
        setMuscleGroupsData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getVisibleGroups = () => {
    // A MÁGICA ACONTECE AQUI!
    // Usamos nosso BODY_PART_MAP para pegar a lista de nomes corretos para a aba ativa
    const visibleGroupNames = BODY_PART_MAP[activeTab];
    // E filtramos os dados que vieram da API para mostrar apenas os grupos dessa lista
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
    return <div className="content-page" style={pageStyle}><h2 className="workout-page-title" style={{color: 'red'}}>Erro: {error}</h2></div>;
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
          // A API nos manda a lista de exercícios dentro de cada grupo. Perfeito!
          <Carousel 
            key={group.id} 
            title={group.name}
            items={group.exercises.map(exercise => ({
              // Usamos um ID numérico único vindo do backend
              id: exercise.id, 
              title: exercise.name,
              // O backend não sabe o endereço do frontend, então não adicionamos a URL base
              imageSrc: `http://127.0.0.1:8000${exercise.image_path}`, 
              link: `/exercicio/${exercise.id}`, 
              // O link agora é para o ID numérico do exercício
              link: `/exercicio/${exercise.id}` 
            }))}
          />
        ))}
      </div>
      <FloatingBackButton to="/central-treino" />
    </div>
  );
}

export default ExerciseLibraryPage;