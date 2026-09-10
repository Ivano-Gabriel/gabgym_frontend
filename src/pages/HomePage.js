// src/pages/HomePage.js — hero de tela única, sem scroll, CTA chamativo

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';
import { isLoggedIn } from '../utils/auth';
import './HomePage.css';

function HomePage() {
  const { t } = useTranslation();
  const loggedIn = isLoggedIn();

  return (
    <div className="home-hero">
      <div className="home-hero-content">
        <span className="home-kicker">Bem-vindo ao</span>
        <h1 className="home-logo">GABGYM</h1>
        <h2 className="home-title">{t('home.titulo')}</h2>
        <p className="home-subtitle" dangerouslySetInnerHTML={{ __html: t('home.subtitulo') }} />

        <Link to={loggedIn ? '/perfil' : '/profile-form'} className="home-cta">
          {loggedIn ? 'Meu Perfil' : 'Começar'} <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}

export default HomePage;