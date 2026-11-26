import React,{useEffect,useMemo,useRef,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {FiActivity,FiArrowRight,FiBarChart2,FiCoffee,FiDroplet,FiRefreshCw,
  FiTarget,FiUsers} from 'react-icons/fi';
import {getCurrentUser,getDiaryLogs,addDiaryLog} from '../services/apiService';
import {dayKey,summarizeDay} from '../utils/nutrition';
import {makeWaterEntry} from '../utils/todayActions';
import {useExperience} from '../context/ExperienceContext';
import TodayDashboard from '../pages/TodayDashboard';
import './AdaptiveTodayDashboard.css';

const routes=[
  {key:'food',label:'REGISTRAR REFEIÇÃO',hint:'Alimentação e calorias',to:'/alimentacao',Icon:FiCoffee},
  {key:'workout',label:'INICIAR UM TREINO',hint:'Fichas, séries e cargas',to:'/treino',Icon:FiActivity},
  {key:'weight',label:'ATUALIZAR PESO',hint:'Medidas e metas',to:'/perfil',Icon:FiTarget},
  {key:'coach',label:'MEU PERSONAL',hint:'Acompanhamento e mensagens',to:'/meu-personal',Icon:FiUsers}
];

function SimpleToday({settings}){
  const {t,i18n}=useTranslation();
  const locale=({pt:'pt-BR',en:'en-US',es:'es-ES',fr:'fr-FR'})[(i18n.language||'pt').slice(0,2)]||'pt-BR';
  const [person,setPerson]=useState(null);
  const [logs,setLogs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const [revision,setRevision]=useState(0);
  const lock=useRef(false);
  useEffect(()=>{
    let alive=true;
    setLoading(true);setError('');
    (async()=>{
      try{
        const profile=(await getCurrentUser()).data;
        if(!profile?.id)throw new Error('Conta indisponível');
        const day=await getDiaryLogs(profile.id,dayKey());
        if(!alive)return;
        setPerson(profile);
        setLogs(Array.isArray(day.data)?day.data:[]);
      }catch{if(alive)setError('Não foi possível consultar seu diário. O servidor pode estar iniciando.');}
      finally{if(alive)setLoading(false);}
    })();
    return()=>{alive=false;};
  },[revision]);
  const totals=useMemo(()=>summarizeDay(logs),[logs]);
  const water=async()=>{
    if(!person?.id||lock.current)return;
    lock.current=true;setBusy(true);setMessage('');
    try{
      const entry=makeWaterEntry(person.id,250);
      await addDiaryLog(entry);
      try{
        const response=await getDiaryLogs(person.id,dayKey());
        setLogs(Array.isArray(response.data)?response.data:[]); 
      }catch{setLogs(old=>[...old,entry]);}
      setMessage(t('simple.waterSaved'));
    }catch{setMessage('Não foi possível confirmar o registro. Confira o diário antes de tentar novamente.');}
    finally{lock.current=false;setBusy(false);}
  };
  const enabled=routes.filter(r=>settings[r.key]);
  return <main className="gg-simple-day">
    <div className="gg-simple-day-wrap">
      <header className="gg-simple-day-hero">
        <span>GABGYM / {t('simple.kicker')}</span>
        <h1>{t('simple.title')}<br/><em>{t('simple.accent')}</em></h1>
        <p>{person?.name&&person.name.split(' ')[0]+' · '}{t('simple.description')}</p>
        <Link to="/experiencia?edit=1">{t('simple.personalize')} <FiArrowRight aria-hidden="true"/></Link>
      </header>
      {loading&&<p role="status" className="gg-simple-day-notice">{t('simple.loading')}</p>}
      {error&&<div role="alert" className="gg-simple-day-notice">{error}
        <button type="button" onClick={()=>setRevision(x=>x+1)}><FiRefreshCw/> {t('simple.retry')}</button>
      </div>}
      {!loading&&!error&&<>
        {settings.food&&<section className="gg-simple-day-progress" aria-label="Meu resumo de alimentação">
          <div><span>{t('simple.foodToday')}</span><strong>{Number(totals.calories||0).toLocaleString(locale)} kcal</strong></div>
          <div><span>{t('simple.waterToday')}</span><strong>{Number(totals.water||0).toLocaleString(locale)} ml</strong></div>
          <button type="button" disabled={busy} onClick={water}><FiDroplet aria-hidden="true"/> {busy?t('simple.registering'):t('simple.addWater')}</button>
        </section>}
        {message&&<p className="gg-simple-day-notice" role="status">{message}</p>}
        <section className="gg-simple-day-actions" aria-label="O que fazer agora">
          <span>{t('simple.actions')}</span>
          {enabled.map(({key,to,label,hint,Icon})=><Link key={key} to={to}>
            <Icon aria-hidden="true"/><span><strong>{t('simple.'+({food:'registerFood',workout:'startWorkout',weight:'updateWeight',coach:'coach'}[key]),{defaultValue:label})}</strong><small>{t('experience.'+key+'Detail',{defaultValue:hint})}</small></span><FiArrowRight aria-hidden="true"/>
          </Link>)}
        </section>
      </>}
    </div>
  </main>;
}

export default function AdaptiveTodayDashboard(){
  const {t}=useTranslation();
  const {settings,ready}=useExperience();
  if(!ready)return <div className="gg-simple-day gg-simple-day-loading" role="status" >{t('experience.loading')}</div>;
  if(settings.mode==='simple')return <SimpleToday settings={settings}/>;
  return <div className={'gg-adaptive-home gg-adaptive-home--'+settings.mode+
    (!settings.food?' gg-adaptive-hide-food':'')+
    (!settings.workout?' gg-adaptive-hide-workout':'')+
    (!settings.weight?' gg-adaptive-hide-weight':'')}>
    <TodayDashboard/>
    {settings.mode==='complete'&&<nav className="gg-adaptive-advanced" aria-label="Ferramentas avançadas">
      <strong>{t('experience.completeDetail')}</strong>
      <div>
        <Link to="/historico"><FiBarChart2/> {t('nav.history')}</Link>
        <Link to="/registros"><FiActivity/> {t('nav.records')}</Link>
        <Link to="/experiencia?edit=1"><FiTarget/> {t('nav.experience')}</Link>
      </div>
    </nav>}
  </div>;
}
