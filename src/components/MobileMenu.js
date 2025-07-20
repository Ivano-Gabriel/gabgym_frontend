// src/components/MobileMenu.js
import React from 'react';
import { Link } from 'react-router-dom';

// --- PALETA DE CORES DO GABGYM ---
const colors = {
  primaryGreen: '#74E85D',
  darkGreen: '#21331D',
  mediumDarkGray: '#303E2E',
  lightGray: '#60695E',
  whiteText: '#f8f9fa',
  darkText: '#1a1a1a',
};
// --- FIM DA PALETA DE CORES ---

function MobileMenu({ isOpen, onClose, onTutorialClick }) {

  // --- FUNÇÃO CORRIGIDA PARA O TUTORIAL ---
  // Esta função garante que o modal abra ANTES do menu fechar.
  const handleTutorialClick = () => {
    if (onTutorialClick) {
      onTutorialClick(); // 1. Abre o modal imediatamente
    }
    setTimeout(() => {
      onClose(); // 2. Fecha o menu 100 milissegundos depois
    }, 100);
  };

  return (
    <>
      <div style={{
        ...styles.mobileMenu,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      }}>
        <button onClick={onClose} style={styles.closeButton}>×</button>

        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/" style={styles.navLink} onClick={onClose}>Início</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/perfil" style={styles.navLink} onClick={onClose}>Perfil</Link>
          </li>

          {/* ===== LINK DO TUTORIAL CORRIGIDO E PADRONIZADO ===== */}
          <li style={styles.navItem}>
            <Link to="#" style={styles.navLink} onClick={handleTutorialClick}>
              Tutorial
            </Link>
          </li>
          {/* ====================================================== */}

          <li style={styles.navItem}>
            <Link to="/portfolio" style={styles.navLink} onClick={onClose}>Sobre o Projeto</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/about-me" style={styles.navLink} onClick={onClose}>Sobre o Programador</Link>
          </li>
        </ul>
      </div>
    </>
  );
}

const styles = {
  mobileMenu: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '260px',
    height: '100vh',
    backgroundColor: colors.darkText,
    borderLeft: `2px solid ${colors.mediumDarkGray}`,
    boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.5)',
    zIndex: 1100,
    transition: 'transform 0.3s ease-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '60px',
    paddingBottom: '20px',
    boxSizing: 'border-box',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '20px',
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.whiteText,
    fontSize: '2em',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    width: '100%',
    textAlign: 'center',
    marginTop: '20px',
  },
  navItem: {
    marginBottom: '15px',
    width: '90%',
    maxWidth: '220px',
    margin: '0 auto 15px auto',
  },
  navLink: {
    color: colors.whiteText,
    textDecoration: 'none',
    fontSize: '1.2em',
    fontWeight: 'bold',
    display: 'block',
    padding: '15px 0',
    backgroundColor: colors.mediumDarkGray,
    border: `1px solid ${colors.lightGray}`,
    borderRadius: '8px',
    transition: 'transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
};

export default MobileMenu;