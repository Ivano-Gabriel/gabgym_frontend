// src/components/ValueProposition.js
import React from 'react';
import './ValueProposition.css';
import { BsGraphUp, BsLightningChargeFill, BsLightbulb } from "react-icons/bs";
import { GiBiceps } from "react-icons/gi";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

function ValueProposition() {
  const { t } = useTranslation();

  const features = [
    { icon: <BsGraphUp />, title: t('home.proposta_card_1_titulo'), description: t('home.proposta_card_1_desc') },
    { icon: <GiBiceps />, title: t('home.proposta_card_2_titulo'), description: t('home.proposta_card_2_desc') },
    { icon: <BsLightningChargeFill />, title: t('home.proposta_card_3_titulo'), description: t('home.proposta_card_3_desc') },
    { icon: <BsLightbulb />, title: t('home.proposta_card_4_titulo'), description: t('home.proposta_card_4_desc') },
    { icon: <FaWhatsapp />, title: t('home.proposta_card_5_titulo'), description: t('home.proposta_card_5_desc') }
  ];

  return (
    <section className="value-prop-section">
      <h2 className="value-prop-title">{t('home.proposta_titulo')}</h2>
      <div className="value-prop-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ValueProposition;