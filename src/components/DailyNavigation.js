import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiActivity, FiCoffee, FiUser, FiShield } from 'react-icons/fi';
import { isSuperAdmin } from '../utils/auth';
import './DailyNavigation.css';

export default function DailyNavigation() {
  const admin = isSuperAdmin();
  const entries = [
    { label: 'Hoje', to: '/', icon: FiHome },
    { label: 'Comer', to: '/alimentacao', icon: FiCoffee },
    { label: 'Treinar', to: '/training-models', icon: FiActivity },
    { label: admin ? 'Admin' : 'Perfil', to: admin ? '/admin' : '/perfil', icon: admin ? FiShield : FiUser },
  ];
  return (
    <nav className="gg-daily-navigation" aria-label="Navegação principal">
      {entries.map(({ label, to, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => 'gg-daily-navitem' + (isActive ? ' active' : '')}>
          <Icon aria-hidden="true" /><span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
