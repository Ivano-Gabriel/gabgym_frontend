// src/pages/FoodLibraryPage.js — conectada ao backend Java, add real ao diário, visual novo

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FoodCard from '../components/FoodCard';
import FloatingBackButton from '../components/FloatingBackButton';
import { getFoods, addDiaryLog } from '../services/apiService';
import './FoodLibraryPage.css';

function FoodLibraryPage() {
  const [foodCategories, setFoodCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState(null);
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
          setActiveCategory(categorias[0].id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar dados de comidas:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Agora manda de verdade pro Diário no backend, em vez de gravar numa chave morta do localStorage
  const handleAddFoodToLog = (food) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Você precisa estar logado para registrar alimentos.');
      return;
    }

    const payload = {
      userId: parseInt(userId, 10),
      type: 'food',
      name: food.name,
      calories: Math.round(food.calories) || 0,
      protein: Math.round(food.protein) || 0,
      carbs: Math.round(food.carbs) || 0,
      fat: Math.round(food.fat) || 0,
      volume: 0,
      logDate: new Date().toLocaleDateString('en-CA'),
      timestamp: Date.now(),
    };

    addDiaryLog(payload)
      .then(() => {
        toast.success(`${food.name} adicionado ao seu diário!`);
      })
      .catch(err => {
        console.error('Erro ao adicionar alimento ao diário:', err);
        toast.error('Não foi possível salvar esse alimento agora.');
      });
  };

  const isSearching = searchTerm.trim().length > 0;

  // Enquanto busca, ignora categorias e mostra tudo que bate, num grid só (sem abrir tudo de uma vez)
  const searchResults = isSearching
    ? foodCategories.flatMap(cat => cat.food_items).filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const activeCategoryData = foodCategories.find(cat => cat.id === activeCategory);

  if (loading) {
    return (
      <div className="food-lib-container">
        <p className="food-lib-status">Carregando biblioteca...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="food-lib-container">
        <p className="food-lib-status error">Erro ao carregar: {error}</p>
      </div>
    );
  }

  return (
    <div className="food-lib-container">
      <div className="food-lib-card">

        <div className="food-lib-top">
          <h1 className="food-lib-title">Biblioteca de Alimentos</h1>
          <p className="food-lib-subtitle">Toque no <strong>+</strong> pra adicionar direto ao seu diário de hoje.</p>
        </div>

        <input
          type="text"
          placeholder="Buscar alimento..."
          className="food-lib-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isSearching ? (
          <>
            <h3 className="food-lib-section-label">
              {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} pra "{searchTerm}"
            </h3>
            <div className="food-lib-grid">
              {searchResults.map(item => (
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
          </>
        ) : (
          <>
            <div className="category-pills">
              {foodCategories.map(category => (
                <button
                  key={category.id}
                  className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {activeCategoryData && (
              <div className="food-lib-grid fade-in-lib">
                {activeCategoryData.food_items.map(item => (
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
            )}
          </>
        )}

      </div>

      <FloatingBackButton to="/diario-alimentar" />
    </div>
  );
}

export default FoodLibraryPage;