// src/pages/DiarioPage.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './DiarioPage.css';
import FundoDeMetas from './goals.jpeg';

import GoalTracker from '../components/GoalTracker';
import ActivityFeed from '../components/ActivityFeed';
import ActivityDetailModal from '../components/ActivityDetailModal';
import { getAtividades } from '../services/apiService';

// Dados mockados para as metas, até a API delas ficar pronta
const mockMetas = [
  { id: 1, texto: 'Correr 5km sem parar', concluida: false, tipo: 'longo_prazo' },
  { id: 2, texto: 'Fazer supino com 80kg', concluida: true, tipo: 'longo_prazo' },
];

function DiarioPage() {
  const { t } = useTranslation();
  
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAtividades();
        setAtividades(response.data);
      } catch (err) {
        setError("Falha ao carregar o histórico de atividades.");
        console.error("Erro detalhado ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    buscarDados();
  }, []);

  const handleCardClick = (atividade) => setAtividadeSelecionada(atividade);
  const handleCloseModal = () => setAtividadeSelecionada(null);

  const metasDeLongoPrazo = mockMetas.filter(meta => meta.tipo === 'longo_prazo' && !meta.concluida);
  const pageStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${FundoDeMetas})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: 'calc(100vh - 70px)',
    padding: '20px',
  };

  return (
    <div className="diario-page-container" style={pageStyle}>
      <h2 className="diario-title">{t('evolutionPanel.title', 'Painel de Evolução')}</h2>
      <p className="diario-subtitle">{t('evolutionPanel.subtitle', 'Acompanhe seu progresso.')}</p>

      <GoalTracker metas={metasDeLongoPrazo} />
      
      {loading && <p className="status-message">Carregando seu histórico...</p>}
      {error && <p className="status-message error">{error}</p>}
      {!loading && !error && (
        <ActivityFeed 
          atividades={atividades} 
          onCardClick={handleCardClick} 
        />
      )}
      
      {atividadeSelecionada && (
        <ActivityDetailModal 
          atividade={atividadeSelecionada}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default DiarioPage;