// src/pages/CuriositiesPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import './CuriositiesPage.css';
import { useTranslation } from 'react-i18next';

// Dados dos cards, com os links corrigidos
const topicsData = {
  suplementacao: {
    title: 'Suplementação',
    items: [
      { id: 'creatina', title: 'Creatina', imageSrc: '/images/curiosidades/creatina.jpg', link: '/biblioteca#creatina' }, 
      { id: 'whey-protein', title: 'Whey Protein', imageSrc: '/images/curiosidades/whey.jpg', link: '/biblioteca#whey-protein' },
      { id: 'cafeina', title: 'Cafeína', imageSrc: '/images/curiosidades/cafeina.jpg', link: '/biblioteca#cafeina' },
      { id: 'hipercalorico', title: 'Hipercalórico', imageSrc: '/images/curiosidades/hiper.jpg', link: '/biblioteca#hipercalorico' },
      { id: 'pre-treino', title: 'Pré-treino', imageSrc: '/images/curiosidades/pret.jpg', link: '/biblioteca#pre-treino' },
    ]
  },
  treino: {
    title: 'Treinamento',
    items: [
      { id: 'cardio', title: 'Cardio', imageSrc: '/images/curiosidades/cardio.jpg', link: '/biblioteca#cardio' },
      { id: 'sono', title: 'Sono', imageSrc: '/images/curiosidades/descanso.jpg', link: '/biblioteca#sono' },
      // Lembre-se que os IDs aqui precisam ser os mesmos do seu arquivo articles.js
      { id: 'falha-muscular', title: 'Falha Muscular', imageSrc: '/images/curiosidades/falha.jpg', link: '/biblioteca#falha-muscular' },
      { id: 'treino-diario', title: 'Treino todo dia?', imageSrc: '/images/curiosidades/todo.jpg', link: '/biblioteca#treino-diario' }, 
      { id: 'genetica', title: 'É a genética?', imageSrc: '/images/curiosidades/gen.jpg', link: '/biblioteca#genetica' },
    ]
  },
  alimentacao: {
    title: 'Alimentação',
    items: [
       // Lembre-se que os IDs aqui precisam ser os mesmos do seu arquivo articles.js
      { id: 'dieta', title: 'Dieta?', imageSrc: '/images/curiosidades/diet.jpg', link: '/biblioteca#dieta' },
      { id: 'proteina', title: 'Proteína?', imageSrc: '/images/curiosidades/proteina.jpg', link: '/biblioteca#proteina' },
      { id: 'gordura', title: 'Gordura?', imageSrc: '/images/curiosidades/gordura.jpg', link: '/biblioteca#gordura' },
      { id: 'carboidrato', title: 'Carboidrato?', imageSrc: '/images/curiosidades/carboidrato.jpg', link: '/biblioteca#carboidrato' },
      { id: 'jejum', title: 'Jejum?', imageSrc: '/images/curiosidades/jejum.jpg', link: '/biblioteca#jejum' },
    ]
  }
};

function CuriositiesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('suplementacao');

  // Criando um novo objeto com os títulos traduzidos para as abas
  const translatedTopicsData = {
    suplementacao: {
      title: t('biblioteca.aba_suplementacao'),
      items: topicsData.suplementacao.items,
    },
    treino: {
      title: t('biblioteca.aba_treinamento'),
      items: topicsData.treino.items,
    },
    alimentacao: {
      title: t('biblioteca.aba_alimentacao'),
      items: topicsData.alimentacao.items,
    }
  };

  return (
    <div className="curiosities-page-container" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/ee.jpg')` }}>
      <h2 className="curiosities-title">{t('hub.curiosidades')}</h2>
      <p className="curiosities-subtitle">{t('biblioteca.subtitulo')}</p>
      
      {/* Botão para a Biblioteca completa */}
      <Link to="/biblioteca" className="cta-button" style={{marginBottom: '40px'}}>
        {t('biblioteca.titulo')}
      </Link>
      
      <div className="topics-tabs-container">
        {Object.keys(translatedTopicsData).map(key => (
          <button 
            key={key}
            className={`topic-tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {translatedTopicsData[key].title}
          </button>
        ))}
      </div>

      {/* Renderiza o carrossel da aba ativa */}
      <Carousel 
        title={translatedTopicsData[activeTab].title} 
        items={translatedTopicsData[activeTab].items} 
      />

      <Link to="/perfil" className="back-button-general">
        {t('metas.botao_voltar_hub')}
      </Link>
    </div>
  );
}

export default CuriositiesPage;