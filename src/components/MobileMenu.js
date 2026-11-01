import React from 'react';
import { Link } from 'react-router-dom';
import { FiHelpCircle, FiUsers, FiFolder, FiBookOpen, FiX } from 'react-icons/fi';
import './MobileMenu.css';

/* O hamburger é apenas para ferramentas secundárias; as quatro ações diárias
   ficam no dock + no Hub GG. */
export default function MobileMenu({isOpen,onClose}){
  const links=[
    {label:'Me ajude',to:'/me-ajude',Icon:FiHelpCircle},
    {label:'Meu personal',to:'/meu-personal',Icon:FiUsers},
    {label:'Diário de atividades',to:'/registros',Icon:FiFolder},
    {label:'Biblioteca de conteúdo',to:'/biblioteca',Icon:FiBookOpen}
  ];
  return <aside className={'gg-mobile-menu'+(isOpen?' open':'')} aria-hidden={!isOpen} aria-label="Menu secundário">
    <button type="button" onClick={onClose} className="gg-mobile-menu-close" aria-label="Fechar menu"><FiX/></button>
    <div className="gg-mobile-menu-heading">MAIS OPÇÕES</div>
    <nav className="gg-mobile-menu-nav" aria-label="Ferramentas secundárias">
      {links.map(({label,to,Icon})=><Link key={to} to={to} className="gg-mobile-menu-link" onClick={onClose} tabIndex={isOpen?0:-1}>
        <Icon aria-hidden="true"/> {label}
      </Link>)}
    </nav>
  </aside>;
}
