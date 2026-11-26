import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FiArrowLeft,FiSave,FiShield} from 'react-icons/fi';
import {useExperience} from '../context/ExperienceContext';
import {normalizeExperience} from '../utils/experience';
import './ExperienceOnboardingPage.css';

const modules=['food','workout','weight','coach'];
const modes=['simple','normal','complete'];
const languages=[['pt','Português'],['en','English'],['es','Español'],['fr','Français']];

export default function ExperienceSettingsPage() {
  const {t}=useTranslation();
  const state=useExperience();
  const [draft,setDraft]=useState(normalizeExperience(state.settings));
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  useEffect(()=>{if(state.ready)setDraft(normalizeExperience(state.settings));},
    [state.ready,state.settings]);
  const save=async event=>{
    event.preventDefault();if(busy)return;
    setBusy(true);setMessage('');setError('');
    try{
      const result=await state.save({...draft,completed:true});
      setMessage(result.source==='server'?t('settings.saved'):t('settings.local'));
    }catch{setError(t('experience.error'));}
    finally{setBusy(false);}
  };
  return <main className="gg-experience gg-settings">
    <div className="gg-experience-wrap">
      <header className="gg-experience-hero">
        <span>{t('settings.kicker')}</span>
        <h1>{t('settings.title')}</h1>
        <p>{t('settings.description')}</p>
      </header>
      {!state.ready?<p role="status">{t('experience.loading')}</p>:<form onSubmit={save} className="gg-experience-form">
        {state.error&&<p className="gg-experience-warning" role="status">{state.error}</p>}
        {error&&<p className="gg-experience-warning" role="alert">{error}</p>}
        {message&&<p className="gg-experience-warning" role="status">{message}</p>}
        <section>
          <div className="gg-experience-heading"><span>01 / {t('settings.modules')}</span>
            <h2>{t('experience.areas')}</h2></div>
          <div className="gg-experience-features">
            {modules.map(key=><label className="gg-experience-feature" key={key}>
              <input type="checkbox" checked={draft[key]} disabled={busy}
                onChange={()=>setDraft(old=>({...old,[key]:!old[key]}))}/>
              <span><strong>{t('experience.'+key)}</strong><small>{t('experience.'+key+'Detail')}</small></span>
            </label>)}
          </div>
        </section>
        <section>
          <div className="gg-experience-heading"><span>02 / {t('settings.mode')}</span><h2>{t('experience.complexity')}</h2></div>
          <div className="gg-experience-modes">
            {modes.map(key=><label key={key} className="gg-experience-mode">
              <input type="radio" name="experience-mode" checked={draft.mode===key}
                onChange={()=>setDraft(old=>({...old,mode:key}))}/>
              <span><strong>{t('experience.'+key)}</strong><small>{t('experience.'+key+'Detail')}</small></span>
            </label>)}
          </div>
        </section>
        <section>
          <div className="gg-experience-heading"><span>03 / {t('settings.language')}</span>
            <h2>{t('experience.language')}</h2></div>
          <label className="gg-settings-language">{t('settings.language')}
            <select value={draft.language} onChange={e=>setDraft(old=>({...old,language:e.target.value}))}>
              {languages.map(([code,name])=><option key={code} value={code}>{name}</option>)}
            </select>
          </label>
        </section>
        <div className="gg-settings-safe"><FiShield aria-hidden="true"/>{t('settings.note')}</div>
        <div className="gg-experience-footer">
          <button type="submit" disabled={busy||!modules.some(key=>draft[key])}><FiSave aria-hidden="true"/>
            {busy?'…':t('settings.save')}</button>
          <Link className="gg-settings-back" to="/perfil"><FiArrowLeft aria-hidden="true"/>{t('settings.back')}</Link>
        </div>
      </form>}
    </div>
  </main>;
}
