import React,{useEffect,useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {NavLink,Link,useLocation} from 'react-router-dom';
import {FiHome,FiActivity,FiCoffee,FiUser,FiShield,FiX,FiTarget,
  FiHeart,FiBarChart2,FiChevronRight,FiBookOpen,FiUsers,FiSettings} from 'react-icons/fi';
import {isSuperAdmin} from '../utils/auth';
import {useExperience} from '../context/ExperienceContext';
import {experienceNavigation} from '../utils/experienceNavigation';
import './DailyNavigation.css';

const icons={
 today:FiHome,food:FiCoffee,workout:FiActivity,weight:FiBarChart2,
 coach:FiUsers,profile:FiUser,cardio:FiHeart,goals:FiTarget,
 library:FiBookOpen,history:FiBarChart2,records:FiActivity,experience:FiSettings
};

export default function DailyNavigation() {
  const {t}=useTranslation();
  const admin=isSuperAdmin();
  const {settings}=useExperience();
  const [open,setOpen]=useState(false);
  const closeRef=useRef(null);
  const triggerRef=useRef(null);
  const dragStart=useRef(null);
  const {pathname}=useLocation();
  useEffect(()=>{setOpen(false);},[pathname]);
  useEffect(()=>{
    if(!open)return undefined;
    const onKey=event=>{
      if(event.key==='Escape')setOpen(false);
      if(event.key==='Tab'){
        const focusable=Array.from(document.querySelectorAll('.gg-hub-sheet a, .gg-hub-sheet button'));
        if(!focusable.length)return;
        const first=focusable[0],last=focusable[focusable.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
        if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
      }
    };
    document.addEventListener('keydown',onKey);
    const trigger=triggerRef.current;
    closeRef.current?.focus();
    return()=>{document.removeEventListener('keydown',onKey);trigger?.focus();};
  },[open]);
  const model=experienceNavigation(settings);
  const primary=admin?[
    {key:'today',label:'Hoje',to:'/'},{key:'food',label:'Comer',to:'/alimentacao'},
    {key:'workout',label:'Treino',to:'/treino'},{key:'profile',label:'Admin',to:'/admin'}
  ]:model.primary;
  const menu=admin?[...model.menu]:model.menu;
  return <>
    <nav className="gg-daily-navigation" aria-label="Navegação principal">
      {primary.slice(0,2).map(({key,label,to})=>{
        const Icon=admin&&key==='profile'?FiShield:(icons[key]||FiHome);
        return <NavLink key={key} to={to} end={to==='/'} className={({isActive})=>'gg-daily-navitem'+(isActive?' active':'')}>
          <Icon aria-hidden="true"/><span>{t('nav.'+key,{defaultValue:label})}</span>
        </NavLink>;
      })}
      <button ref={triggerRef} type="button" className={'gg-hub-trigger'+(open?' active':'')}
        aria-label={open?t('nav.collapseHub'):t('nav.openHub')} aria-expanded={open} aria-controls="gg-hub-sheet"
        onClick={()=>setOpen(value=>!value)}>
        <span className="gg-hub-glyph" aria-hidden="true"><img src="/gg-mark.svg" alt=""/></span><span>{t('nav.hub')}</span>
      </button>
      {primary.slice(2).map(({key,label,to})=>{
        const Icon=admin&&key==='profile'?FiShield:(icons[key]||FiUser);
        return <NavLink key={key} to={to} className={({isActive})=>'gg-daily-navitem'+(isActive?' active':'')}>
          <Icon aria-hidden="true"/><span>{t('nav.'+key,{defaultValue:label})}</span>
        </NavLink>;
      })}
    </nav>
    <button type="button" tabIndex={open?0:-1} aria-hidden={!open}
      className={'gg-hub-overlay'+(open?' is-visible':'')} aria-label="Fechar painel" onClick={()=>setOpen(false)}/>
    <section className={'gg-hub-sheet'+(open?' is-visible':'')} id="gg-hub-sheet" role="dialog"
      aria-modal={open?'true':undefined} aria-hidden={!open} aria-label="Hub GABGYM">
      <div className="gg-hub-handle" aria-hidden="true"
        onTouchStart={e=>{dragStart.current=e.touches[0]?.clientY??null;}}
        onTouchEnd={e=>{const y=e.changedTouches[0]?.clientY;
          if(dragStart.current!==null&&y!=null&&y-dragStart.current>65)setOpen(false);
          dragStart.current=null;}}/>
      <div className="gg-hub-sheet-head">
        <div><span>GABGYM / ACESSO RÁPIDO</span><h2>SEU HUB<span>.</span></h2></div>
        <button ref={closeRef} tabIndex={open?0:-1} type="button" aria-label={t('nav.closeHub')}
          onClick={()=>setOpen(false)}><FiX/></button>
      </div>
      <div className="gg-hub-links">
        {menu.map(({key,to,summary,title},index)=>{
          const Icon=icons[key]||FiTarget;
          return <Link key={key} to={to} tabIndex={open?0:-1}
            onClick={()=>setOpen(false)} style={{'--gg-card-index':index}}
            className={'gg-hub-link'+(key==='coach'?' gg-hub-link--personal':'')}>
            <Icon aria-hidden="true"/>
            <span><strong>{t('nav.'+key,{defaultValue:title})}</strong><small>{summary}</small></span>
            <FiChevronRight aria-hidden="true"/>
          </Link>;
        })}
      </div>
      <p className="gg-hub-caption">{t('nav.dayByDay')}</p>
    </section>
  </>;
}
