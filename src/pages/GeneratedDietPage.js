// src/pages/GeneratedDietPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GENERATED_DIETS } from '../data/GeneratedDiets';

function GeneratedDietPage() {
  const [userObjective, setUserObjective] = useState(null);
  const [diets, setDiets] = useState([]);
  const [openCard, setOpenCard] = useState(null);

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/images/dieta.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };
  useEffect(() => {
    const storedUserDataString = localStorage.getItem('gabgymUserData');
    if (storedUserDataString) {
      const userData = JSON.parse(storedUserDataString);
      if (userData.objective) {
        setUserObjective(userData.objective);
        setDiets(GENERATED_DIETS[userData.objective] || []);
      }
    }
  }, []);

  const toggleCard = (index) => {
    setOpenCard(openCard === index ? null : index);
  };

  if (!userObjective) {
    return (
      <div className="content-page">
        <h2 className="workout-page-title">Dietas Geradas</h2>
        <p className="content-description">Não encontramos seu objetivo. Por favor, <Link to="/profile-form" style={{color: 'var(--primaryGreen)'}}>preencha seu perfil</Link> para ver sugestões de dieta.</p>
        <Link to="/dietas" className="back-button-general">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">Sugestões de Dieta</h2>
      <p className="content-description">Com base no seu objetivo, aqui estão 3 opções de planos alimentares. Use como base e adapte conforme sua necessidade.</p>
      
      <div className="diet-options-container">
        {diets.map((diet, index) => (
          <div key={index} className="diet-option-card">
            <button className="diet-option-header" onClick={() => toggleCard(index)}>
              <h3>{diet.name}</h3>
              <p>{diet.description}</p>
            </button>
            {openCard === index && (
              <div className="diet-meal-plan">
                {Object.keys(diet.meals).map(mealName => (
                  <div key={mealName} className="meal-section">
                    <h4>{mealName}</h4>
                    <ul>
                      {diet.meals[mealName].map((food, foodIndex) => (
                        <li key={foodIndex}>{food}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Link to="/dietas" className="back-button-general">Voltar</Link>
    </div>
  );
}

export default GeneratedDietPage;