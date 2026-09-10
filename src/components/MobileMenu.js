// src/components/MobileMenu.js — reformulado pro visual novo (preto+verde+neon)

import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiPlayCircle, FiInfo, FiUserCheck, FiX } from 'react-icons/fi';
import './MobileMenu.css';

function MobileMenu({ isOpen, onClose, onTutorialClick }) {

  const handleTutorialClick = () => {
    if (onTutorialClick) {
      onTutorialClick();
    }
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <div className={`gg-mobile-menu ${isOpen ? 'open' : ''}`}>
      <button onClick={onClose} className="gg-mobile-menu-close" aria-label="Fechar menu">
        <FiX />
      </button>

      <nav className="gg-mobile-menu-nav">
        <Link to="/" className="gg-mobile-menu-link" onClick={onClose}>
          <FiHome /> Início
        </Link>
        <Link to="/perfil" className="gg-mobile-menu-link" onClick={onClose}>
          <FiUser /> Perfil
        </Link>
        <Link to="#" className="gg-mobile-menu-link" onClick={handleTutorialClick}>
          <FiPlayCircle /> Tutorial
        </Link>
        <Link to="/portfolio" className="gg-mobile-menu-link" onClick={onClose}>
          <FiInfo /> Sobre o Projeto
        </Link>
        <Link to="/about-me" className="gg-mobile-menu-link" onClick={onClose}>
          <FiUserCheck /> Sobre o Programador
        </Link>
      </nav>
    </div>
  );
}

export default MobileMenu;