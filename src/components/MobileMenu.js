import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiActivity, FiCoffee, FiUser, FiShield, FiX } from 'react-icons/fi';
import { isLoggedIn, isSuperAdmin } from '../utils/auth';
import './MobileMenu.css';

export default function MobileMenu({ isOpen, onClose }) {
  const authenticated = isLoggedIn();
  const admin = isSuperAdmin();
  const sections = [
    { label: 'Hoje', to: '/', Icon: FiHome },
    { label: 'Alimentação diária', to: authenticated ? '/alimentacao' : '/signup', Icon: FiCoffee },
    { label: 'Treino e cardio', to: '/training-models', Icon: FiActivity },
    { label: admin ? 'Painel administrativo' : 'Meu perfil', to: admin ? '/admin' : authenticated ? '/perfil' : '/login', Icon: admin ? FiShield : FiUser },
  ];
  return (
    <div className={'gg-mobile-menu' + (isOpen ? ' open' : '')} aria-hidden={!isOpen}>
      <button type="button" onClick={onClose} className="gg-mobile-menu-close" aria-label="Fechar menu"><FiX /></button>
      <nav className="gg-mobile-menu-nav" aria-label="Mais opções">
        {sections.map(({label,to,Icon})=>(
          <Link key={to + label} to={to} className="gg-mobile-menu-link" onClick={onClose} tabIndex={isOpen?0:-1}>
            <Icon aria-hidden="true" /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
