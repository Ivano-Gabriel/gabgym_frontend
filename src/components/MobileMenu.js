import React,{useEffect,useRef} from 'react';
import { Link } from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import { FiHelpCircle, FiUsers, FiFolder, FiBookOpen, FiX } from 'react-icons/fi';
import './MobileMenu.css';

export default function MobileMenu({isOpen,onClose}){
  const {t}=useTranslation();
  const closeRef=useRef(null);
  const navRef=useRef(null);
  useEffect(()=>{
    if(!isOpen)return undefined;
    closeRef.current?.focus();
    const onKey=e=>{
      if(e.key==='Escape'){onClose();return;}
      if(e.key==='Tab'){
        const focusable=[closeRef.current,...Array.from(navRef.current?.querySelectorAll('a')||[])].filter(Boolean);
        const first=focusable[0],last=focusable[focusable.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    };
    document.addEventListener('keydown',onKey);
    return()=>document.removeEventListener('keydown',onKey);
  },[isOpen,onClose]);
  const links=[
    {label:t('nav.help'),to:'/me-ajude',Icon:FiHelpCircle},
    {label:t('nav.coachMenu'),to:'/meu-personal',Icon:FiUsers},
    {label:t('nav.activityLog'),to:'/registros',Icon:FiFolder},
    {label:t('nav.contentLibrary'),to:'/biblioteca',Icon:FiBookOpen}
  ];
  return <aside className={'gg-mobile-menu'+(isOpen?' open':'')} aria-hidden={!isOpen} aria-label={t('nav.secondaryMenu')}>
    <button ref={closeRef} tabIndex={isOpen?0:-1} type="button" onClick={onClose} className="gg-mobile-menu-close" aria-label={t('nav.closeMenu')}><FiX/></button>
    <div className="gg-mobile-menu-heading">{t('nav.moreOptions')}</div>
    <nav ref={navRef} className="gg-mobile-menu-nav" aria-label={t('nav.secondaryTools')}>
      {links.map(({label,to,Icon},index)=><Link key={to} to={to} style={{'--drawer-index':index}} className="gg-mobile-menu-link" onClick={onClose} tabIndex={isOpen?0:-1}>
        <Icon aria-hidden="true"/> {label}
      </Link>)}
    </nav>
  </aside>;
}
