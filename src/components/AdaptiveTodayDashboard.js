import React,{useEffect,useMemo,useRef,useState} from 'react';
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
      setMessage('Água registrada: +250 ml.');
    }catch{setMessage('Não foi possível confirmar o registro. Confira o diário antes de tentar novamente.');}
    finally{lock.current=false;setBusy(false);}
  };
  const enabled=routes.filter(r=>settings[r.key]);
  return <main className="gg-simple-day">
    <div className="gg-simple-day-wrap">
      <header className="gg-simple-day-hero">
        <span>GABGYM / MEU DIA</span>
        <h1>UM PASSO<br/><em>DE CADA VEZ.</em></h1>
        <p>{person?.name?('Vamos nessa, '+person.name.split(' ')[0]+'.'):'O importante é continuar.'} Só o essencial, sem distrações.</p>
        <Link to="/experiencia?edit=1">PERSONALIZAR MINHA EXPERIÊNCIA <FiArrowRight aria-hidden="true"/></Link>
      </header>
      {loading&&<p role="status" className="gg-simple-day-notice">Carregando seu dia…</p>}
      {error&&<div role="alert" className="gg-simple-day-notice">{error}
        <button type="button" onClick={()=>setRevision(x=>x+1)}><FiRefreshCw/> TENTAR NOVAMENTE</button>
      </div>}
      {!loading&&!error&&<>
        {settings.food&&<section className="gg-simple-day-progress" aria-label="Meu resumo de alimentação">
          <div><span>ALIMENTAÇÃO HOJE</span><strong>{Number(totals.calories||0).toLocaleString('pt-BR')} kcal</strong></div>
          <div><span>ÁGUA HOJE</span><strong>{Number(totals.water||0).toLocaleString('pt-BR')} ml</strong></div>
          <button type="button" disabled={busy} onClick={water}><FiDroplet aria-hidden="true"/> {busy?'REGISTRANDO…':'+250 ML DE ÁGUA'}</button>
        </section>}
        {message&&<p className="gg-simple-day-notice" role="status">{message}</p>}
        <section className="gg-simple-day-actions" aria-label="O que fazer agora">
          <span>O QUE VOCÊ QUER FAZER?</span>
          {enabled.map(({key,to,label,hint,Icon})=><Link key={key} to={to}>
            <Icon aria-hidden="true"/><span><strong>{label}</strong><small>{hint}</small></span><FiArrowRight aria-hidden="true"/>
          </Link>)}
        </section>
      </>}
    </div>
  </main>;
}

export default function AdaptiveTodayDashboard(){
  const {settings,ready}=useExperience();
  if(!ready)return <div className="gg-simple-day gg-simple-day-loading" role="status">Preparando sua experiência…</div>;
  if(settings.mode==='simple')return <SimpleToday settings={settings}/>;
  return <div className={'gg-adaptive-home gg-adaptive-home--'+settings.mode+
    (!settings.food?' gg-adaptive-hide-food':'')+
    (!settings.workout?' gg-adaptive-hide-workout':'')+
    (!settings.weight?' gg-adaptive-hide-weight':'')}>
    <TodayDashboard/>
    {settings.mode==='complete'&&<nav className="gg-adaptive-advanced" aria-label="Ferramentas avançadas">
      <strong>FERRAMENTAS DA SUA EVOLUÇÃO</strong>
      <div>
        <Link to="/historico"><FiBarChart2/> HISTÓRICO DETALHADO</Link>
        <Link to="/registros"><FiActivity/> REGISTROS COMPLETOS</Link>
        <Link to="/experiencia?edit=1"><FiTarget/> PERSONALIZAR</Link>
      </div>
    </nav>}
  </div>;
}
