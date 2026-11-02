import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FiHome, FiActivity, FiCoffee, FiUser, FiShield, FiX, FiTarget, FiHeart, FiBarChart2, FiChevronRight, FiBookOpen, FiUsers } from 'react-icons/fi';
import { isSuperAdmin } from '../utils/auth';
import './DailyNavigation.css';

/** GG é uma ação clara, não um gesto escondido. */
export default function DailyNavigation() {
  const admin = isSuperAdmin();
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);
  const dragStart=useRef(null);
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
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); trigger?.focus(); };
  }, [open]);
  const primary = [
    { label: 'Hoje', to: '/', icon: FiHome },
    { label: 'Comer', to: '/alimentacao', icon: FiCoffee },
    { label: 'Treino', to: '/treino', icon: FiActivity },
    { label: admin ? 'Admin' : 'Perfil', to: admin ? '/admin' : '/perfil', icon: admin ? FiShield : FiUser },
  ];
  const menu = [
    { label: 'Alimentação', to: '/alimentacao', icon: FiCoffee, summary: 'Registre suas refeições' },
    { label: 'Treinos', to: '/treino', icon: FiActivity, summary: 'Continue seu treino' },
    { label: 'Cardio', to: '/cardio/select', icon: FiHeart, summary: 'Escolha sua atividade' },
    { label: 'Metas', to: '/minhas-metas', icon: FiTarget, summary: 'Defina o próximo passo' },
    { label: 'Progresso', to: '/perfil', icon: FiBarChart2, summary: 'Sua evolução' },
    { label: 'Biblioteca', to: '/biblioteca', icon: FiBookOpen, summary: 'Aprenda e pratique' },
    { label: 'Meu Personal', to: '/meu-personal', icon: FiUsers, summary: 'Seu foco, seus treinos' },
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
          <span className="gg-hub-glyph" aria-hidden="true"><img src="/gg-mark.svg" alt="" /></span><span>Hub</span>
        </button>
        {primary.slice(2).map(({ label, to, icon: Icon }) =>
          <NavLink key={to} to={to} className={({isActive}) => 'gg-daily-navitem' + (isActive ? ' active' : '')}>
            <Icon aria-hidden="true" /><span>{label}</span>
          </NavLink>)}
      </nav>
      <>
        <button type="button" tabIndex={open?0:-1} aria-hidden={!open} className={"gg-hub-overlay"+(open?" is-visible":"")} aria-label="Fechar painel" onClick={() => setOpen(false)} />
        <section className={"gg-hub-sheet"+(open?" is-visible":"")} id="gg-hub-sheet" role="dialog" aria-modal={open?"true":undefined} aria-hidden={!open} aria-label="Hub GABGYM">
          <div className="gg-hub-handle" aria-hidden="true"
  onTouchStart={e=>{dragStart.current=e.touches[0]?.clientY??null;}}
  onTouchEnd={e=>{const y=e.changedTouches[0]?.clientY;if(dragStart.current!==null&&y!=null&&y-dragStart.current>65)setOpen(false);dragStart.current=null;}}/>
          <div className="gg-hub-sheet-head">
            <div><span>GABGYM / ACESSO RÁPIDO</span><h2>SEU HUB<span>.</span></h2></div>
            <button ref={closeRef} tabIndex={open?0:-1} type="button" aria-label="Fechar hub" onClick={() => setOpen(false)}><FiX/></button>
          </div>
          <div className="gg-hub-links">
            {menu.map(({label,to,summary,icon:Icon},index) =>
              <Link key={to} to={to} tabIndex={open?0:-1} onClick={() => setOpen(false)} style={{"--gg-card-index":index}} className="gg-hub-link">
                <Icon aria-hidden="true" /><span><strong>{label}</strong><small>{summary}</small></span><FiChevronRight aria-hidden="true"/>
              </Link>)}
          </div>
          <p className="gg-hub-caption">UM DIA DE CADA VEZ.</p>
        </section>
      </>
    </>
  );
}
