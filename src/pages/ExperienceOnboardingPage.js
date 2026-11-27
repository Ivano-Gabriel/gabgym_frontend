import React,{useEffect,useState} from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FiArrowRight,FiCheck,FiCoffee,FiTarget,FiUsers,FiActivity} from 'react-icons/fi';
import {useExperience} from '../context/ExperienceContext';
import {normalizeExperience,onboardingProfilePayload} from '../utils/experience';
import {logoutUser,getCurrentUser,updateUser} from '../services/apiService';
import './ExperienceOnboardingPage.css';
import OnboardingBodyMap from '../components/OnboardingBodyMap';

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
  const [selectedMode,setSelectedMode]=useState(null);
  const [localOffered,setLocalOffered]=useState(false);
  const [step,setStep]=useState(0);
  const [profile,setProfile]=useState({gender:'',objective:'',age:'',weight:'',height:''});
  const [training,setTraining]=useState({level:'',duration:'',focus:[]});
  const [profileSaved,setProfileSaved]=useState(false);
  const [localTrainingWarning,setLocalTrainingWarning]=useState(false);
  const total=7;
  const changeProfile=(key,value)=>{setProfile(old=>({...old,[key]:value}));setProfileSaved(false);};
  const goNext=()=>{if(step===4){try{onboardingProfilePayload(profile);}catch{setError(t('wizard.invalid'));return;}}setError('');setStep(n=>Math.min(total-1,n+1));};
  const toggleFocus=key=>setTraining(old=>({...old,focus:key==='whole'?(old.focus.includes(key)?[]:[key]):old.focus.includes(key)?old.focus.filter(x=>x!==key):[...old.focus.filter(x=>x!=='whole'),key]}));

  useEffect(()=>{if(experience.ready)setDraft(normalizeExperience(experience.settings));},
    [experience.ready,experience.settings]);

  useEffect(()=>{
    if(experience.ready&&experience.settings.completed&&!edit)
      navigate('/',{replace:true});
  },[experience.ready,experience.settings.completed,edit,navigate]);

  const save=async(event,local=false)=>{
    event.preventDefault();if(saving||step!==total-1||!selectedMode||!features.some(item=>draft[item.key]))return;
    setSaving(true);setError('');
    try{
      const payload=onboardingProfilePayload(profile);
      if(!profileSaved&&Object.keys(payload).length){
        try{
          const me=await getCurrentUser();
          if(!experience.accountId||String(me.data?.id)!==String(experience.accountId))throw new Error('Account unavailable');
          await updateUser(me.data.id,payload);
          setProfileSaved(true);
        }catch{setError(t('wizard.profileError'));return;}
      }
      if(experience.accountId&&(training.level||training.duration||training.focus.length)){
        try{localStorage.setItem('gabgym:training-preferences:'+experience.accountId,JSON.stringify(training));}
        catch{setLocalTrainingWarning(true);return;}
      }
      const input={...draft,mode:selectedMode,completed:true};
      if(local)await experience.saveLocal(input);
      else await experience.save(input);
      navigate('/',{replace:true});
    }catch{setError(t('experience.error'));if(!local)setLocalOffered(true);}
    finally{setSaving(false);}
  };
  const exit=async()=>{if(saving)return;try{await logoutUser();}catch{}navigate('/login',{replace:true});};
  const select=key=>setDraft(old=>({...old,[key]:!old[key]}));

  const choice=(key,value,label,selected,onChange,detail)=> <label key={value} className={'gg-wizard-option'+(selected===value?' selected':'')}>
    <input type="radio" name={key} value={value} checked={selected===value} disabled={saving} onChange={()=>onChange(value)}/>
    <span><strong>{label}</strong>{detail&&<small>{detail}</small>}</span>{selected===value&&<FiCheck aria-hidden="true"/>}
  </label>;
  const titles=['sexTitle','goalTitle','experienceTitle','focusTitle','bodyTitle',null,null];
  return <main className="gg-experience gg-wizard">
    <div className="gg-wizard-wrap">
      <header className="gg-wizard-top"><img src="/gg-mark.svg" alt="GABGYM"/><span>{t('wizard.step',{current:step+1,total})}</span><button type="button" disabled={saving||step===0} onClick={()=>{setError('');setStep(n=>n-1);}}>{t('wizard.backStep')}</button></header>
      <div className="gg-wizard-progress" role="progressbar" aria-label={t('wizard.step',{current:step+1,total})} aria-valuemin={1} aria-valuemax={total} aria-valuenow={step+1}>{Array.from({length:total},(_,i)=><span key={i} className={i<=step?'done':''}/>)}</div>
      {!experience.ready?<p role="status">{t('experience.loading')}</p>:<form className="gg-wizard-form" onSubmit={event=>{event.preventDefault();if(step<total-1)goNext();else save(event);}}>
        <div className="gg-wizard-content" key={step}>
          <h1>{titles[step]?t('wizard.'+titles[step]):step===5?t('experience.complexity'):t('experience.areas')}</h1>
          {error&&<p role="alert" className="gg-experience-warning">{error}</p>}
          {step===0&&<><p>{t('wizard.sexNote')}</p><div className="gg-wizard-options">{[['male','male'],['female','female'],['unspecified','unspecified']].map(([v,k])=>choice('gender',v,t('wizard.'+k),profile.gender,x=>changeProfile('gender',x)))}</div></>}
          {step===1&&<div className="gg-wizard-options gg-wizard-goals">{[['lose-fat','lose'],['gain-muscle','gain'],['maintain-weight','maintain']].map(([v,k])=>choice('objective',v,t('wizard.'+k),profile.objective,x=>changeProfile('objective',x)))}</div>}
          {step===2&&<><div className="gg-wizard-options">{['beginner','intermediate','advanced'].map(v=>choice('level',v,t('wizard.'+v),training.level,x=>setTraining(old=>({...old,level:x}))))}</div><h2>{t('wizard.duration')}</h2><div className="gg-wizard-options">{['new','underYear','oneThree','overThree'].map(v=>choice('duration',v,t('wizard.'+v),training.duration,x=>setTraining(old=>({...old,duration:x}))))}</div></>}
          {step===3&&<><div className="gg-wizard-focus"><div className="gg-wizard-options">{['whole','shoulders','arms','chest','core','back','glutes','legs'].map(key=><label key={key} className={'gg-wizard-option'+(training.focus.includes(key)?' selected':'')}><input type="checkbox" checked={training.focus.includes(key)} onChange={()=>toggleFocus(key)}/><span>{t('wizard.'+key)}</span></label>)}</div><div className="gg-wizard-maps"><OnboardingBodyMap selected={training.focus}/><OnboardingBodyMap selected={training.focus} back/></div></div><p>{t('wizard.localTraining')}</p></>}
          {step===4&&<><p>{t('wizard.bodyNote')}</p><div className="gg-wizard-measures">{[['age',13,120,1],['weight',20,600,.1],['height',100,250,.1]].map(([key,min,max,increment])=><label key={key}>{t('wizard.'+key)}<input type="number" inputMode={key==='age'?'numeric':'decimal'} min={min} max={max} step={increment} value={profile[key]} onChange={event=>changeProfile(key,event.target.value)}/></label>)}</div></>}
          {step===5&&<div className="gg-wizard-options">{modes.map(key=>choice('mode',key,t('experience.'+key),selectedMode,x=>{setSelectedMode(x);setDraft(old=>({...old,mode:x}));},t('experience.'+key+'Detail')))}</div>}
          {step===6&&<><div className="gg-wizard-options">{features.map(({key,Icon})=><label key={key} className={'gg-wizard-option'+(draft[key]?' selected':'')}><input type="checkbox" checked={Boolean(draft[key])} disabled={saving} onChange={()=>select(key)}/><Icon aria-hidden="true"/><span><strong>{t('experience.'+key)}</strong><small>{t('experience.'+key+'Detail')}</small></span></label>)}</div><label className="gg-experience-language">{t('settings.language')}<select disabled={saving} value={draft.language} onChange={event=>setDraft(old=>({...old,language:event.target.value}))}>{languages.map(([code,label])=><option key={code} value={code}>{label}</option>)}</select></label>{experience.error&&<p role="status" className="gg-experience-warning">{t(experience.error)}</p>}{localTrainingWarning&&<p role="alert">{t('wizard.localTraining')}</p>}{(localOffered||experience.source==='local')&&<div className="gg-experience-warning gg-local-choice"><p>{t('experience.localChoice')}</p><button type="button" disabled={saving||!selectedMode||!features.some(item=>draft[item.key])} onClick={event=>save(event,true)}>{t('experience.saveLocal')}</button></div>}</>}
        </div>
        <footer className="gg-wizard-footer">{step<5&&<small>{t('wizard.optional')}</small>}<button className="gg-wizard-next" type="submit" disabled={saving||(step===5&&!selectedMode)||(step===6&&(!selectedMode||!features.some(item=>draft[item.key])))}>{saving?'…':step===6?(edit?t('experience.save'):t('experience.start')):t('wizard.next')}<FiArrowRight aria-hidden="true"/></button><button type="button" className="gg-wizard-exit" disabled={saving} onClick={exit}>{t('profilePage.logout')}</button></footer>
      </form>}
    </div>
  </main>;
}
