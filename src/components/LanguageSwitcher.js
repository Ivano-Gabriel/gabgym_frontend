import React,{useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FiGlobe} from 'react-icons/fi';
import {useExperience} from '../context/ExperienceContext';
import '../styles/adaptivePolish.css';

const options=[{value:'pt',label:'Português'},{value:'en',label:'English'},
  {value:'es',label:'Español'},{value:'fr',label:'Français'}];

export default function LanguageSwitcher({compact=false}){
  const {i18n,t}=useTranslation();
  const {settings,accountId,save}=useExperience();
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const change=async event=>{
    const next=event.target.value;
    if(!options.some(item=>item.value===next)||busy)return;
    setBusy(true);setError('');
    await i18n.changeLanguage(next);
    try{localStorage.setItem('gabgym:interface-language',next);}catch{}
    if(accountId){
      try{await save({...settings,language:next});}
      catch{setError('Idioma alterado neste navegador, mas não sincronizado.');}
    }
    setBusy(false);
  };
  return <div className={'gg-language-switcher'+(compact?' is-compact':'')}>
    <FiGlobe aria-hidden="true"/>
    <label>
      <span className="gg-language-sr-only">{t('auth.language')}</span>
      <select aria-label={t('auth.language')} value={(i18n.language||'pt').slice(0,2)}
        onChange={change} disabled={busy}>
        {options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
    {error&&<span role="status" className="gg-language-error">{error}</span>}
  </div>;
}
