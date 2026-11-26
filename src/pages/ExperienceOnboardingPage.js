import React,{useEffect,useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FiArrowRight,FiCheck,FiCoffee,FiTarget,FiUsers,FiActivity} from 'react-icons/fi';
import {useExperience} from '../context/ExperienceContext';
import {normalizeExperience} from '../utils/experience';
import './ExperienceOnboardingPage.css';

const features=[{key:'food',Icon:FiCoffee},{key:'workout',Icon:FiActivity},
  {key:'weight',Icon:FiTarget},{key:'coach',Icon:FiUsers}];
const modes=['simple','normal','complete'];
const languages=[['pt','Português'],['en','English'],['es','Español'],['fr','Français']];

export default function ExperienceOnboardingPage() {
  const {t}=useTranslation();
  const experience=useExperience();
  const navigate=useNavigate();
  const location=useLocation();
  const edit=new URLSearchParams(location.search).get('edit')==='1';
  const [draft,setDraft]=useState(normalizeExperience(experience.settings));
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');

  useEffect(()=>{if(experience.ready)setDraft(normalizeExperience(experience.settings));},
    [experience.ready,experience.settings]);

  useEffect(()=>{
    if(experience.ready&&experience.settings.completed&&!edit)
      navigate('/',{replace:true});
  },[experience.ready,experience.settings.completed,edit,navigate]);

  const save=async event=>{
    event.preventDefault();if(saving)return;
    setSaving(true);setError('');
    try{
      const outcome=await experience.save({...draft,completed:true});
      if(outcome.source==='local')setMessage(t('experience.offline'));
      else navigate('/',{replace:true});
    }catch{setError(t('experience.error'));}
    finally{setSaving(false);}
  };
  const skip=async()=>{
    if(saving)return;
    setSaving(true);
    try{
      await experience.save({...experience.settings,completed:true});
      navigate('/',{replace:true});
    }catch{setError(t('experience.error'));setSaving(false);}
  };
  const select=key=>setDraft(old=>({...old,[key]:!old[key]}));

  return <main className="gg-experience">
    <div className="gg-experience-wrap">
      <header className="gg-experience-hero">
        <span>GABGYM / {t('experience.kicker')}</span>
        <h1>{t('experience.titleTop')}<br/><em>{t('experience.titleBottom')}</em></h1>
        <p>{t('experience.description')}</p>
      </header>
      {!experience.ready?<p role="status">{t('experience.loading')}</p>:
      <form onSubmit={save} className="gg-experience-form">
        {experience.error&&<p role="status" className="gg-experience-warning">{experience.error}</p>}
        {error&&<p role="alert" className="gg-experience-warning">{error}</p>}
        {message&&<p role="status" className="gg-experience-warning">{message}
          <Link to="/">{t('experience.continue')}</Link></p>}
        <section aria-label={t('experience.areas')}>
          <div className="gg-experience-heading"><span>01 / {t('experience.kicker')}</span>
            <h2>{t('experience.areas')}</h2></div>
          <div className="gg-experience-features">
            {features.map(({key,Icon})=><label className="gg-experience-feature" key={key}>
              <input type="checkbox" checked={Boolean(draft[key])} disabled={saving}
                onChange={()=>select(key)}/>
              <Icon aria-hidden="true"/><span><strong>{t('experience.'+key)}</strong>
                <small>{t('experience.'+key+'Detail')}</small></span>
              {draft[key]&&<FiCheck aria-hidden="true"/>}
            </label>)}
          </div>
        </section>
        <section aria-label={t('experience.complexity')}>
          <div className="gg-experience-heading"><span>02 / {t('experience.kicker')}</span>
            <h2>{t('experience.complexity')}</h2></div>
          <div className="gg-experience-modes">
            {modes.map(key=><label key={key} className="gg-experience-mode">
              <input type="radio" name="mode" value={key} checked={draft.mode===key}
                onChange={()=>setDraft(old=>({...old,mode:key}))}/>
              <span><strong>{t('experience.'+key)}</strong>
                <small>{t('experience.'+key+'Detail')}</small></span>
            </label>)}
          </div>
        </section>
        <section>
          <div className="gg-experience-heading"><span>03 / {t('experience.language')}</span>
            <h2>{t('experience.language')}</h2></div>
          <label className="gg-experience-language">{t('settings.language')}
            <select value={draft.language} onChange={e=>setDraft(old=>({...old,language:e.target.value}))}>
              {languages.map(([code,label])=><option key={code} value={code}>{label}</option>)}
            </select>
          </label>
        </section>
        <div className="gg-experience-footer">
          <button type="submit" disabled={saving||!features.some(item=>draft[item.key])}>
            {saving?'…':edit?t('experience.save'):t('experience.start')}<FiArrowRight aria-hidden="true"/>
          </button>
          {!edit&&<button type="button" className="gg-experience-skip" disabled={saving} onClick={skip}>
            {t('experience.skip')}</button>}
        </div>
      </form>}
    </div>
  </main>;
}
