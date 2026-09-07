// components/LogoDropdown.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const colors = {
  primaryGreen: '#74E85D',
  mediumDarkGray: '#303E2E',
  whiteText: '#f8f9fa',
};

const LogoDropdown = ({ isOpen, onClose }) => {
  useEffect(() => {
    // Ativa o blur no body quando o dropdown abre
    const blur = document.getElementById('logo-overlay-blur');
    if (blur) {
      blur.classList.toggle('active', isOpen);
    }

    // Limpa ao desmontar
    return () => {
      if (blur) {
        blur.classList.remove('active');
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay BLUR */}
      <div
        id="logo-overlay-blur"
        className="site-blur-overlay active"
        onClick={onClose} // Clicando fora fecha
      />

      {/* Menu flutuante */}
      <div className="logo-dropdown open" style={styles.dropdown}>
        <Link to="/portfolio" style={styles.link} onClick={onClose}>
          Sobre o GabGym
        </Link>
        <Link to="/about" style={styles.link} onClick={onClose}>
          Sobre o Programador
        </Link>
      </div>
    </>
  );
};

const styles = {
  dropdown: {
    position: 'fixed',
    top: '70px',
    left: '20px',
    backgroundColor: colors.mediumDarkGray,
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.5)',
    zIndex: 1200, // Acima do overlay
    display: 'flex',
    flexDirection: 'column',
  },
  link: {
    color: colors.whiteText,
    textDecoration: 'none',
    padding: '12px 15px',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: '5px',
  },
};

export default LogoDropdown;
