import React,{useEffect,useState} from 'react';
import {NavLink,useLocation} from 'react-router-dom';
import {FiActivity,FiBarChart2,FiChevronLeft,FiChevronRight,FiCoffee,
  FiHeart,FiHome,FiTarget,FiUser,FiUsers,FiBookOpen,FiSettings} from 'react-icons/fi';
import {useExperience} from '../context/ExperienceContext';
import {experienceNavigation} from '../utils/experienceNavigation';
import './DesktopRail.css';

const icons={
 today:FiHome,food:FiCoffee,workout:FiActivity,weight:FiBarChart2,
 coach:FiUsers,profile:FiUser,cardio:FiHeart,goals:FiTarget,
 library:FiBookOpen,history:FiBarChart2,records:FiActivity,experience:FiSettings
};

export default function DesktopRail() {
  const [expanded,setExpanded]=useState(false);
  const {pathname}=useLocation();
  const {settings}=useExperience();
  useEffect(()=>{setExpanded(false);},[pathname]);
  useEffect(()=>{
    if(!expanded)return undefined;
    const onKeyDown=event=>{if(event.key==='Escape')setExpanded(false);};
    document.addEventListener('keydown',onKeyDown);
    return()=>document.removeEventListener('keydown',onKeyDown);
  },[expanded]);

  const data=experienceNavigation(settings);
  const shown=[{key:'today',to:'/',label:'Hoje'},
    ...data.menu.map(item=>({key:item.key,to:item.to,label:item.label}))];
  if(!shown.some(x=>x.to==='/perfil'))shown.push({key:'profile',to:'/perfil',label:'Perfil'});
  return <aside className={'gg-desktop-rail'+(expanded?' is-expanded':'')} aria-label="Barra lateral GabGym">
    <div className="gg-desktop-rail-brand">
      <img src="/gg-mark.svg" alt="" aria-hidden="true"/>
      {expanded&&<strong>GABGYM</strong>}
      <button type="button" aria-label={expanded?'Recolher barra lateral':'Expandir barra lateral'}
        aria-expanded={expanded} aria-controls="gg-desktop-rail-links"
        onClick={()=>setExpanded(v=>!v)}>
        {expanded?<FiChevronLeft aria-hidden="true"/>:<FiChevronRight aria-hidden="true"/>}
      </button>
    </div>
    <nav id="gg-desktop-rail-links" aria-label="Acessos rápidos"
      className="gg-desktop-rail-links" aria-hidden={!expanded}>
      {shown.map(({key,to,label})=>{
        const Icon=icons[key]||FiHome;
        return <NavLink key={key} to={to} end={to==='/'} tabIndex={expanded?0:-1}
          onClick={()=>setExpanded(false)} className={({isActive})=>
            'gg-desktop-rail-link'+(isActive?' is-active':'')}>
          <Icon aria-hidden="true"/><span>{label}</span>
        </NavLink>;
      })}
    </nav>
    {expanded&&<p className="gg-desktop-rail-foot">CONSTÂNCIA ACIMA DE PERFEIÇÃO.</p>}
  </aside>;
}
