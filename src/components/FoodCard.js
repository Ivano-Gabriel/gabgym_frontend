// src/components/FoodCard.js

import React from 'react';
import { FiPlus } from 'react-icons/fi';
import './FoodCard.css';

function FoodCard({ name, serving_desc, calories, imageSrc, onAdd, showAddButton = false, protein, carbs, fat, db_id }) {

  const foodItem = { db_id, name, serving_desc, calories, imageSrc, protein, carbs, fat };

  return (
    <div className="food-item-card">
      <img src={imageSrc} alt={name} className="food-item-image" />
      <div className="food-item-info">
        <h4>{name}</h4>
        <p className="food-item-serving">{serving_desc}</p>
        <div className="food-item-macros">
          <span>{Math.round(calories)} kcal</span>
          {protein > 0 && <span>P {Math.round(protein)}g</span>}
          {carbs > 0 && <span>C {Math.round(carbs)}g</span>}
          {fat > 0 && <span>G {Math.round(fat)}g</span>}
        </div>
      </div>
      {showAddButton && (
         <button onClick={() => onAdd(foodItem)} className="add-food-button" title={`Adicionar ${name} ao diário`}>
           <FiPlus />
         </button>
      )}
    </div>
  );
}

export default FoodCard;