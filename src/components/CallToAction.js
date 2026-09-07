// src/components/CallToAction.js
import React from 'react';
import { Link } from 'react-router-dom';
import './CallToAction.css';
import { useTranslation } from 'react-i18next'; // 1. IMPORTA A FERRAMENTA

function CallToAction() {
  const { t } = useTranslation(); // 2. ATIVA A FERRAMENTA

  return (
    <div className="cta-section">
      {/* 3. USA A FERRAMENTA */}
      <h2 className="cta-title">{t('home.chamada_final_titulo')}</h2>
      
      <Link to="/profile-form" className="cta-button-final">
        {t('home.chamada_final_botao')}
      </Link>
    </div>
  );
}

export default CallToAction;