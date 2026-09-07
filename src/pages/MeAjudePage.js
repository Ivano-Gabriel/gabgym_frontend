// src/pages/MeAjudePage.js
import React, { useState } from 'react';
import './MeAjudePage.css';
import { FaWhatsapp, FaInstagram, FaEnvelope } from 'react-icons/fa';

// Mini-componente para o item do FAQ (Acordeão)
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <span className={`faq-arrow ${isOpen ? 'open' : ''}`}>›</span>
      </div>
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

function MeAjudePage() {
  const faqs = [
    { q: "Como o GabGym cria meus treinos?", a: "Nossos treinos são baseados em metodologias consagradas de musculação, adaptados para a frequência que você escolher. Eles são um excelente ponto de partida para iniciantes e intermediários." },
    { q: "Os dados que eu registro no Diário de Bordo são privados?", a: "Sim! 100% privados. Todos os seus dados de metas, fotos, cardio e dieta são salvos de forma segura e só você tem acesso a eles." },
    { q: "Posso usar o GabGym de graça?", a: "Sim! O GabGym é um projeto de portfólio e uma ferramenta para a comunidade. Todas as funcionalidades atuais são e sempre serão gratuitas." },
  ];

  return (
    <div className="me-ajude-container">
      <div className="me-ajude-content">
        <h1 className="me-ajude-title">Central de Ajuda & Contato</h1>
        <p className="me-ajude-text">
          Tem alguma dúvida, sugestão ou encontrou algum problema? Estamos aqui para ajudar.
        </p>

        <div className="ajuda-section">
          <h2 className="ajuda-section-title">Perguntas Frequentes (FAQ)</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>

        <div className="ajuda-section">
          <h2 className="ajuda-section-title">Fale Comigo</h2>
          <div className="contact-list">
            <a href="https://wa.me/5582996230505" target="_blank" rel="noopener noreferrer" className="contact-item">
              <FaWhatsapp className="contact-icon whatsapp" />
              <span>WhatsApp</span>
            </a>
            <a href="https://instagram.com/i.gabriel13_" target="_blank" rel="noopener noreferrer" className="contact-item">
              <FaInstagram className="contact-icon instagram" />
              <span>Instagram</span>
            </a>
            <a href="mailto:gabrimelo90@gmail.com" className="contact-item">
              <FaEnvelope className="contact-icon email" />
              <span>E-mail</span>
            </a>

            
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default MeAjudePage;