// src/pages/ExerciseDetailPage.js (Versão Final Conectada à API)

import React, { useState, useEffect } from 'react'; // Precisamos do useState e useEffect
import { useParams, Link } from 'react-router-dom';
import LazyLoadVideo from '../components/LazyLoadVideo';
import './ExerciseDetailPage.css';

function ExerciseDetailPage() {
  const { exerciseId } = useParams(); // Pega o ID do exercício da URL
  
  // 1. NOVOS "CÉREBROS": um para o exercício e outro para o estado de carregamento
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. A MÁGICA DA CONEXÃO: Busca os dados do exercício específico na nossa API
  useEffect(() => {
    // Montamos a URL para pedir o exercício exato que queremos
    const apiUrl = `http://127.0.0.1:8000/api/exercises/${exerciseId}/`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error('Exercício não encontrado na API');
        return response.json();
      })
      .then(data => {
        setExercise(data); // Guardamos os dados do exercício no nosso estado
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar exercício:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [exerciseId]); // Roda essa lógica toda vez que o exerciseId da URL mudar

  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('/images/detail-bg.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  // Mensagens de carregando e erro, para uma melhor experiência
  if (loading) {
    return <div className="content-page" style={pageStyle}><h2 className="workout-page-title">Carregando Exercício...</h2></div>;
  }
  
  if (error || !exercise) {
    return (
      <div className="content-page" style={pageStyle}>
        <h2 className="workout-page-title">Exercício não encontrado</h2>
        <p>O exercício que você procurou não existe na nossa base de dados.</p>
        <Link to="/exercise-library" className="back-button-general">Voltar para a Biblioteca</Link>
      </div>
    );
  }

  // 3. O RESULTADO FINAL: O código visual continua o mesmo, mas agora com os dados da API!
  return (
    <div className="content-page" style={pageStyle}>
      <div className="exercise-detail-container">
        <h2 className="exercise-detail-title">{exercise.name}</h2>
        <div className="exercise-detail-video">
          <LazyLoadVideo src={`http://127.0.0.1:8000${exercise.local_video_path}`} />
        </div>
        <div className="exercise-detail-description">
          <h3>Como Executar:</h3>
          <p>{exercise.description}</p>
        </div>
        <Link to="/exercise-library" className="back-button-general">Voltar para a Biblioteca</Link>
      </div>
    </div>
  );
}

export default ExerciseDetailPage;