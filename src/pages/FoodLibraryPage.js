// src/pages/FoodLibraryPage.js (Versão com Acordeão e Busca)

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FoodCard from '../components/FoodCard';
import FloatingBackButton from '../components/FloatingBackButton';
import './FoodLibraryPage.css'; // O CSS também será atualizado

function FoodLibraryPage() {
  const [foodCategories, setFoodCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // <<< NOVOS ESTADOS PARA O UPGRADE >>>
  const [openCategory, setOpenCategory] = useState(null); // Controla qual categoria está aberta
  const [searchTerm, setSearchTerm] = useState('');     // Controla o texto da busca

  useEffect(() => {
    // ... o código de fetch continua o mesmo ...
    const apiUrl = 'http://127.0.0.1:8000/api/food-categories/';
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error('Falha na comunicação com a API de comidas.');
        return response.json();
      })
      .then(data => {
        setFoodCategories(data);
        // Deixa a primeira categoria aberta por padrão
        if (data && data.length > 0) {
            setOpenCategory(data[0].id);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar dados de comidas:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleAddFoodToLog = (food) => {
    // ... a função de adicionar ao diário continua a mesma ...
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
    // Se a categoria clicada já está aberta, fecha. Senão, abre.
    setOpenCategory(prevOpenCategory => (prevOpenCategory === categoryId ? null : categoryId));
  };
  
  // Filtra as categorias e comidas baseado na busca
  const filteredCategories = foodCategories
    .map(category => ({
      ...category,
      food_items: category.food_items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(category => category.food_items.length > 0);


  const pageStyle = { /* ...código de estilo continua igual... */ };

  if (loading) { /* ...código de loading/error continua igual... */ }
  if (error) { /* ...código de loading/error continua igual... */ }

  return (
    <div className="content-page" style={pageStyle}>
      <h2 className="workout-page-title">Biblioteca de Alimentos</h2>
      <p className="content-description">Clique para expandir e '+' para adicionar ao seu diário.</p>
      
      {/* <<< BARRA DE BUSCA IMPLEMENTADA >>> */}
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
          // <<< LÓGICA DO ACORDEÃO IMPLEMENTADA >>>
          <div key={category.id} className="accordion-item-lib">
            <button className="accordion-header-lib" onClick={() => toggleCategory(category.id)}>
              <span>{category.name}</span>
              <span className='accordion-icon-lib'>{openCategory === category.id ? '−' : '+'}</span>
            </button>
            {/* O conteúdo só aparece se a categoria estiver aberta */}
            {(openCategory === category.id || searchTerm.length > 0) && (
              <div className="accordion-content-lib">
                <div className="food-items-grid">
                  {category.food_items.map(item => (
                    <FoodCard
                      key={item.id}
                      db_id={item.id}
                      name={item.name}
                      serving_desc={item.serving_desc}
                      calories={item.calories}
                      protein={item.protein} carbs={item.carbs} fat={item.fat}
                      imageSrc={`http://127.0.0.1:8000${item.image_path}`}
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