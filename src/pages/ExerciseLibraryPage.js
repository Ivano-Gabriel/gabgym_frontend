// src/pages/ExerciseLibraryPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import exerciseLibraryData from '../data/exerciseLibraryData';
import './ExerciseLibraryPage.css';

function ExerciseLibraryPage() {
  const [activeTab, setActiveTab] = useState('superior');

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('/images/library-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
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
        {exerciseLibraryData[activeTab].muscleGroups.map(group => (
          <Carousel 
            key={group.name} 
            title={group.name}
            items={group.items.filter(item => item.type !== 'subheading').map(exercise => {
              const exerciseId = exercise.name.toLowerCase().replace(/\s/g, '-');
              return {
                id: exerciseId,
                title: exercise.name,
                imageSrc: exercise.image || '/images/card-placeholder.jpg',
                link: `/exercicio/${exerciseId}` // <<< AQUI ESTÁ A MUDANÇA
              };
            })}
          />
        ))}
      </div>
      <Link to="/training-models" className="back-button-general" style={{marginTop: '40px'}}>Voltar</Link>
    </div>
  );
}

export default ExerciseLibraryPage;