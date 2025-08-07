// src/pages/ExerciseLibraryPage.js (Versão Corrigida e Otimizada)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
// 1. IMPORTAÇÃO CORRETA: Trocamos o 'exerciseLibraryData' antigo e manual
// pela nossa fonte de dados centralizada e inteligente.
import { WORKOUT_GROUPS, EXERCISE_LIBRARY } from '../data/workoutDatabase'; 
import FloatingBackButton from '../components/FloatingBackButton';
import './ExerciseLibraryPage.css';

function ExerciseLibraryPage() {
  // A lógica para separar em superior/inferior agora fica aqui dentro do componente
  const superiorGroups = ['peito-triceps', 'costas-biceps', 'ombro-completo', 'trapezio', 'antebraco', 'abdomen'];
  const inferiorGroups = ['pernas-completo', 'quadriceps', 'posterior-coxa', 'gluteos', 'panturrilhas', 'adutores-abdutores'];

  const [activeTab, setActiveTab] = useState('superior');

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('/images/run.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  // 2. LÓGICA ATUALIZADA: Criamos uma função para pegar os grupos corretos a serem exibidos
  const getVisibleGroups = () => {
    const groupKeys = activeTab === 'superior' ? superiorGroups : inferiorGroups;
    // Filtramos para garantir que só mostraremos grupos que realmente existem no nosso WORKOUT_GROUPS
    return groupKeys.filter(key => WORKOUT_GROUPS[key]);
  };

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">Biblioteca de Exercícios</h2>
      <p className="content-description">Navegue, aprenda a execução e monte seu próprio treino.</p>

      <div className="tabs-container">
        <button className={`tab-button ${activeTab === 'superior' ? 'active' : ''}`} onClick={() => setActiveTab('superior')}>Membros Superiores</button>
        <button className={`tab-button ${activeTab === 'inferior' ? 'active' : ''}`} onClick={() => setActiveTab('inferior')}>Membros Inferiores</button>
      </div>

      <div className="carousels-container">
        {/* 3. O 'MAP' CORRIGIDO: Agora iteramos sobre os grupos corretos */}
        {getVisibleGroups().map(groupKey => {
          const group = WORKOUT_GROUPS[groupKey];
          // E aqui está a mágica: usamos os IDs para buscar os detalhes completos na nossa enciclopédia
          const itemsForCarousel = group.exerciseIds.map(exerciseId => {
            const exercise = EXERCISE_LIBRARY[exerciseId];
            return {
              id: exercise.id, // << Usamos o ID OFICIAL da nossa base de dados
              title: exercise.name,
              imageSrc: exercise.image || '/images/card-placeholder.jpg',
              link: `/exercicio/${exercise.id}` // << O link agora usa o ID OFICIAL, corrigindo o erro "Não Encontrado"
            };
          });

          return (
            <Carousel 
              key={group.title} 
              title={group.title}
              items={itemsForCarousel}
            />
          );
        })}
      </div>
      
      {/* O seu ExerciseDetailPage.js já estava perfeito, então o botão de voltar agora deve funcionar */}
      <FloatingBackButton to="/training-models" />
    </div>
  );
}

export default ExerciseLibraryPage;