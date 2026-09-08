// src/pages/FoodLibraryPage.js (Versão conectada ao backend Java)

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FoodCard from '../components/FoodCard';
import FloatingBackButton from '../components/FloatingBackButton';
import { getFoods } from '../services/apiService';
import './FoodLibraryPage.css';

function FoodLibraryPage() {
  const [foodCategories, setFoodCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openCategory, setOpenCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getFoods()
      .then(response => {
        const items = response.data; // lista plana de alimentos, cada um com "category" dentro

        // Agrupa os itens por categoria (o backend Java não manda isso aninhado)
        const categoriasMap = new Map();
        items.forEach(item => {
          const catId = item.category.id;
          if (!categoriasMap.has(catId)) {
            categoriasMap.set(catId, {
              id: catId,
              name: item.category.name,
              food_items: [],
            });
          }
          categoriasMap.get(catId).food_items.push(item);
        });

        const categorias = Array.from(categoriasMap.values());
        setFoodCategories(categorias);

        if (categorias.length > 0) {
          setOpenCategory(categorias[0].id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar dados de comidas:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAddFoodToLog = (food) => {
    const currentLog = JSON.parse(localStorage.getItem('gabgymTodaysLog') || '[]');
    const newLogEntry = {
      ...food,
      id: food.db_id,
      calories: Math.round(food.calories), protein: Math.round(food.protein),
      carbs: Math.round(food.carbs), fat: Math.round(food.fat),
      timestamp: Date.now(), type: 'food'
    };
    currentLog.push(newLogEntry);
    localStorage.setItem('gabgymTodaysLog', JSON.stringify(currentLog));
    toast.success(`${food.name} adicionado ao seu diário!`);
  };

  const toggleCategory = (categoryId) => {
    setOpenCategory(prevOpenCategory => (prevOpenCategory === categoryId ? null : categoryId));
  };

  const filteredCategories = foodCategories
    .map(category => ({
      ...category,
      food_items: category.food_items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(category => category.food_items.length > 0);

  const pageStyle = {};

  if (loading) {
    return <div className="content-page" style={pageStyle}><h2 className="workout-page-title">Carregando Biblioteca...</h2></div>;
  }
  if (error) {
    return <div className="content-page" style={pageStyle}><h2 className="workout-page-title" style={{ color: 'red' }}>Erro: {error}</h2></div>;
  }

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">Biblioteca de Alimentos</h2>
      <p className="content-description">Clique para expandir e '+' para adicionar ao seu diário.</p>

      <div className="library-search-container">
        <input
          type="text"
          placeholder="Buscar alimento..."
          className="library-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="food-library-container">
        {filteredCategories.map(category => (
          <div key={category.id} className="accordion-item-lib">
            <button className="accordion-header-lib" onClick={() => toggleCategory(category.id)}>
              <span>{category.name}</span>
              <span className='accordion-icon-lib'>{openCategory === category.id ? '−' : '+'}</span>
            </button>
            {(openCategory === category.id || searchTerm.length > 0) && (
              <div className="accordion-content-lib">
                <div className="food-items-grid">
                  {category.food_items.map(item => (
                    <FoodCard
                      key={item.id}
                      db_id={item.id}
                      name={item.name}
                      serving_desc={item.servingDesc}
                      calories={item.calories}
                      protein={item.protein} carbs={item.carbs} fat={item.fat}
                      imageSrc={item.imagePath}
                      onAdd={handleAddFoodToLog}
                      showAddButton={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <FloatingBackButton to="/diario-alimentar" />
    </div>
  );
}

export default FoodLibraryPage;