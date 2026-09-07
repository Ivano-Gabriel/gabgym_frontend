// src/components/FoodCard.js (Versão Corrigida)

import React from 'react';
import './FoodCard.css';

// 1. A PRIMEIRA MUDANÇA ESTÁ AQUI: Avisamos o componente para também receber protein, carbs, e fat
function FoodCard({ name, serving_desc, calories, imageSrc, onAdd, showAddButton = false, protein, carbs, fat, db_id }) {
  
  // 2. A SEGUNDA MUDANÇA ESTÁ AQUI: Incluímos os macros no pacote que será enviado
  const foodItem = { db_id, name, serving_desc, calories, imageSrc, protein, carbs, fat };

  return (
    <div className="food-item-card">
      <img src={imageSrc} alt={name} className="food-item-image" />
      <div className="food-item-info">
        <h4>{name}</h4>
        <p>{serving_desc}</p>
        <p className="food-calories">{Math.round(calories)} kcal</p>
      </div>
      {showAddButton && (
         <button onClick={() => onAdd(foodItem)} className="add-food-button">+</button>
      )}
    </div>
  );
}

export default FoodCard;