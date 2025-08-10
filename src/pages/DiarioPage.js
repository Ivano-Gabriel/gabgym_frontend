// src/pages/DiarioPage.js - VERSÃO COM CHAMADA DE API
import React, { useState, useEffect } from 'react'; // Importamos o useEffect
import { useTranslation } from 'react-i18next';
import './DiarioPage.css';
import FundoDeMetas from './goals.jpeg';

// Nossos componentes especialistas
import GoalTracker from '../components/GoalTracker';
import ActivityFeed from '../components/ActivityFeed';
import ActivityDetailModal from '../components/ActivityDetailModal';

// Nosso serviço de comunicação!
import { getAtividades } from '../services/apiService';

// --- DADOS MOCKADOS (Ainda aqui para o GoalTracker, por enquanto) ---
const mockMetas = [
  { id: 1, texto: 'Correr 5km sem parar', concluida: false, tipo: 'longo_prazo' },
  { id: 2, texto: 'Fazer supino com 80kg', concluida: true, tipo: 'longo_prazo' },
];
// -----------------------------------------------------------------

function DiarioPage() {
  const { t } = useTranslation();

  // --- NOVOS ESTADOS PARA CONTROLAR OS DADOS REAIS ---
  const [atividades, setAtividades] = useState([]); // Começa como uma lista vazia
  const [loading, setLoading] = useState(true); // Começa carregando
  const [error, setError] = useState(null); // Começa sem erros
  // ---------------------------------------------------

  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

  // --- O useEffect VAI BUSCAR OS DADOS QUANDO A PÁGINA CARREGAR ---
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await getAtividades(); // Chama nossa API!
        setAtividades(response.data); // Coloca os dados do backend no nosso estado
        setError(null);
      } catch (err) {
        setError("Falha ao carregar o histórico de atividades."); // Armazena a mensagem de erro
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false); // Para de carregar, independentemente de ter dado certo ou errado
      }
    };

    buscarDados();
  }, []); // O [] vazio faz com que isso rode apenas uma vez, quando o componente é montado.
  // ----------------------------------------------------------------

  const handleCardClick = (atividade) => { setAtividadeSelecionada(atividade); };
  const handleCloseModal = () => { setAtividadeSelecionada(null); };

  const metasDeLongoPrazo = mockMetas.filter(meta => meta.tipo === 'longo_prazo');
  const pageStyle = { /* ... seu código de estilo ... */ };

  return (
    <div className="diario-page-container" style={pageStyle}>
      <h2 className="diario-title">{t('evolutionPanel.title', 'Painel de Evolução')}</h2>
      <p className="diario-subtitle">{t('evolutionPanel.subtitle', 'Acompanhe seu progresso.')}</p>

      <GoalTracker metas={metasDeLongoPrazo} />
      
      {/* LÓGICA DE EXIBIÇÃO CONDICIONAL */}
      {loading && <p style={{color: 'white', fontSize: '1.2em'}}>Carregando seu histórico...</p>}
      {error && <p style={{color: 'red', fontSize: '1.2em'}}>{error}</p>}
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