// src/pages/MuscleGroupPage.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import LazyLoadVideo from '../components/LazyLoadVideo'; 
import FloatingBackButton from '../components/FloatingBackButton';


function MuscleGroupPage() {
  const location = useLocation();
  const { workoutData } = location.state || {}; 

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/ee.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  const descriptionStyle = {
    color: '#FFFFFF', 
    fontWeight: 'bold',
    fontSize: '1.1em',
    lineHeight: '1.7',
    textAlign: 'left',
    opacity: 0.9,
    marginTop: '20px',
    whiteSpace: 'pre-wrap', 
  };
  
  if (!workoutData) {
    // ... código de erro ...
  }

  return (
    <div className="content-page" style={pageStyle}> 
      <h2 className="content-title">{workoutData.title}</h2>
      
      <div className="exercise-list-container">
        {workoutData.exercises.map((item, index) => {
          // NOVIDADE: Verificando se o item é um subtítulo ou um exercício
          if (item.type === 'subheading') {
            return <h3 key={index} className="exercise-subheading">{item.text}</h3>;
          }
          
          // Se não for um subtítulo, é um exercício normal
          return (
            <div key={index} className="exercise-item">
              <h4 className="exercise-name">{item.name}</h4> {/* Mudei para h4 para diferenciar do subtítulo */}
              
              {item.localVideo && (
                <LazyLoadVideo src={item.localVideo} />
              )}

              {item.description && (
                <p style={descriptionStyle}>
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <FloatingBackButton />
    </div>
  );
}

export default MuscleGroupPage;