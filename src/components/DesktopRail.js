import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiActivity, FiBarChart2, FiChevronLeft, FiChevronRight, FiCoffee, FiHeart, FiHome, FiTarget, FiUser, FiUsers } from 'react-icons/fi';
import './DesktopRail.css';

const links = [
  { to:'/',label:'Hoje',Icon:FiHome, end:true },
  { to:'/treino',label:'Treino',Icon:FiActivity },
  { to:'/meu-personal',label:'Meu Personal',Icon:FiUsers },
  { to:'/alimentacao',label:'Comer',Icon:FiCoffee },
  { to:'/cardio/select',label:'Cardio',Icon:FiHeart },
  { to:'/minhas-metas',label:'Metas',Icon:FiTarget },
  { to:'/historico',label:'Histórico',Icon:FiBarChart2 },
  { to:'/perfil',label:'Perfil',Icon:FiUser },
];

/** Navegação desktop independente do hub móvel e da autenticação. */
export default function DesktopRail() {
  const [expanded, setExpanded] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setExpanded(false); }, [pathname]);
  useEffect(() => {
    if (!expanded) return undefined;
    const onKeyDown = event => { if (event.key === 'Escape') setExpanded(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [expanded]);

  return <aside className={'gg-desktop-rail'+(expanded?' is-expanded':'')} aria-label="Barra lateral GabGym">
    <div className="gg-desktop-rail-brand">
      <img src="/gg-mark.svg" alt="" aria-hidden="true" />
      {expanded && <strong>GABGYM</strong>}
      <button type="button" aria-label={expanded ? 'Recolher barra lateral' : 'Expandir barra lateral'}
        aria-expanded={expanded} aria-controls="gg-desktop-rail-links"
        onClick={() => setExpanded(v => !v)}>
        {expanded ? <FiChevronLeft aria-hidden="true" /> : <FiChevronRight aria-hidden="true" />}
      </button>
    </div>
    <nav id="gg-desktop-rail-links" aria-label="Acessos rápidos"
      className="gg-desktop-rail-links" aria-hidden={!expanded}>
      {links.map(({to,label,Icon,end}) =>
        <NavLink key={to} to={to} end={end} tabIndex={expanded?0:-1}
          onClick={() => setExpanded(false)}
          className={({isActive})=>'gg-desktop-rail-link'+(isActive?' is-active':'')}>
          <Icon aria-hidden="true" /><span>{label}</span>
        </NavLink>)}
    </nav>
    {expanded && <p className="gg-desktop-rail-foot">CONSTÂNCIA ACIMA DE PERFEIÇÃO.</p>}
  </aside>;
}
