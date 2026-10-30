import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FiHome, FiActivity, FiCoffee, FiUser, FiShield, FiX, FiTarget, FiHeart, FiBarChart2, FiChevronRight } from 'react-icons/fi';
import { isSuperAdmin } from '../utils/auth';
import './DailyNavigation.css';

/** GG é uma ação clara, não um gesto escondido. */
export default function DailyNavigation() {
  const admin = isSuperAdmin();
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = event => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'Tab') {
        const focusable = Array.from(document.querySelectorAll('.gg-hub-sheet a, .gg-hub-sheet button'));
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); triggerRef.current?.focus(); };
  }, [open]);
  const primary = [
    { label: 'Hoje', to: '/', icon: FiHome },
    { label: 'Comer', to: '/alimentacao', icon: FiCoffee },
    { label: 'Treino', to: '/training-models', icon: FiActivity },
    { label: admin ? 'Admin' : 'Perfil', to: admin ? '/admin' : '/perfil', icon: admin ? FiShield : FiUser },
  ];
  const menu = [
    { label: 'Alimentação', to: '/alimentacao', icon: FiCoffee, summary: 'Registre suas refeições' },
    { label: 'Treinos', to: '/training-models', icon: FiActivity, summary: 'Continue seu treino' },
    { label: 'Cardio', to: '/cardio/select', icon: FiHeart, summary: 'Escolha sua atividade' },
    { label: 'Metas', to: '/minhas-metas', icon: FiTarget, summary: 'Defina o próximo passo' },
    { label: 'Progresso', to: '/perfil', icon: FiBarChart2, summary: 'Veja sua evolução' },
  ];
  return (
    <>
      <nav className="gg-daily-navigation" aria-label="Navegação principal">
        {primary.slice(0, 2).map(({ label, to, icon: Icon }) =>
          <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => 'gg-daily-navitem' + (isActive ? ' active' : '')}>
            <Icon aria-hidden="true" /><span>{label}</span>
          </NavLink>)}
        <button ref={triggerRef} type="button" className={'gg-hub-trigger' + (open ? ' active' : '')}
          aria-label={open ? 'Recolher hub' : 'Abrir hub'} aria-expanded={open} aria-controls="gg-hub-sheet"
          onClick={() => setOpen(value => !value)}>
          <span className="gg-hub-glyph" aria-hidden="true">GG</span><span>Hub</span>
        </button>
        {primary.slice(2).map(({ label, to, icon: Icon }) =>
          <NavLink key={to} to={to} className={({isActive}) => 'gg-daily-navitem' + (isActive ? ' active' : '')}>
            <Icon aria-hidden="true" /><span>{label}</span>
          </NavLink>)}
      </nav>
      {open && <>
        <button type="button" className="gg-hub-overlay" aria-label="Fechar painel" onClick={() => setOpen(false)} />
        <section className="gg-hub-sheet" id="gg-hub-sheet" role="dialog" aria-modal="true" aria-label="Hub GABGYM">
          <div className="gg-hub-handle" aria-hidden="true" />
          <div className="gg-hub-sheet-head">
            <div><span>GABGYM / ACESSO RÁPIDO</span><h2>SEU HUB<span>.</span></h2></div>
            <button ref={closeRef} type="button" aria-label="Fechar hub" onClick={() => setOpen(false)}><FiX/></button>
          </div>
          <div className="gg-hub-links">
            {menu.map(({label,to,summary,icon:Icon}) =>
              <Link key={to} to={to} onClick={() => setOpen(false)} className="gg-hub-link">
                <Icon aria-hidden="true" /><span><strong>{label}</strong><small>{summary}</small></span><FiChevronRight aria-hidden="true"/>
              </Link>)}
          </div>
          <p className="gg-hub-caption">UM DIA DE CADA VEZ.</p>
        </section>
      </>}
    </>
  );
}
