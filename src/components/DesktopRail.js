import React from 'react';
import {useTranslation} from 'react-i18next';
import {NavLink} from 'react-router-dom';
import {FiActivity,FiBarChart2,FiCoffee,
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
  const {t}=useTranslation();
  const {settings}=useExperience();
  const data=experienceNavigation(settings);
  const shown=[{key:'today',to:'/',label:'Hoje'},
    ...data.menu.map(item=>({key:item.key,to:item.to,label:item.label}))];
  if(!shown.some(x=>x.to==='/perfil'))shown.push({key:'profile',to:'/perfil',label:'Perfil'});
  return <aside className="gg-desktop-rail is-expanded" aria-label={t('nav.sidebar')}>
    <div className="gg-desktop-rail-brand">
      <img src="/gg-mark.svg" alt="" aria-hidden="true"/>
      <strong>GABGYM</strong>
    </div>
    <nav id="gg-desktop-rail-links" aria-label={t('nav.shortcuts')}
      className="gg-desktop-rail-links">
      {shown.map(({key,to,label})=>{
        const Icon=icons[key]||FiHome;
        return <NavLink key={key} to={to} end={to==='/'} className={({isActive})=>
            'gg-desktop-rail-link'+(isActive?' is-active':'')}>
          <Icon aria-hidden="true"/><span>{t('nav.'+key,{defaultValue:label})}</span>
        </NavLink>;
      })}
    </nav>
    <p className="gg-desktop-rail-foot">{t('nav.consistency')}</p>
  </aside>;
}
