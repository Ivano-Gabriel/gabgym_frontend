// src/pages/HomePage.js
import React from 'react';
import NextPageButton from '../components/NextPageButton';
import ValueProposition from '../components/ValueProposition';
import CallToAction from '../components/CallToAction';
import { useTranslation } from 'react-i18next'; // A ferramenta de tradução
import './HomePage.css'; // USANDO O SEU CSS NORMAL, SEM O '.MODULE'

function HomePage() {
  const { t } = useTranslation(); // Ativando a ferramenta

  return (
    <>
      {/* As classes voltaram ao normal, com aspas duplas */}
      <div className="home-hero-container"> 
        <div className="hero-content">
        <h1 className="hero-title">{t('home.titulo')}</h1>
        <p className="hero-subtitle" dangerouslySetInnerHTML={{ __html: t('home.subtitulo') }} />
        </div>
        <NextPageButton to="/profile-form" />
      </div>

      <ValueProposition />
      <CallToAction />
    </>
  );
}

export default HomePage;