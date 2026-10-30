import React,{useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {FiActivity,FiArrowLeft,FiClock,FiCoffee,FiDroplet,FiRefreshCw,FiTrash2,FiX,FiCheck,FiCalendar} from 'react-icons/fi';
import {getCurrentUser,getDiaryLogs,deleteDiaryLog} from '../services/apiService';
import {dayKey,summarizeDay} from '../utils/nutrition';
import './RegistrosPage.css';

const icons={food:FiCoffee,water:FiDroplet,cardio:FiActivity,exercise:FiActivity};
const types=[
  {value:'all',label:'Todos'},
  {value:'food',label:'Alimentação'},
  {value:'movement',label:'Movimento'},
  {value:'water',label:'Água'}
];
const matches=(row,filter)=>filter==='all'||row.type===filter||
  (filter==='movement'&&['cardio','exercise'].includes(row.type));
const number=value=>Number(value).toLocaleString('pt-BR',{maximumFractionDigits:1});
const safe=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,n):0;};
const timeMeta=seconds=>{
  const s=safe(seconds),min=Math.floor(s/60);
  return min ? min+' min' : s ? Math.round(s)+' s' : null;
};
export default function RegistrosPage(){
  const [logs,setLogs]=useState([]);
  const [filter,setFilter]=useState('all');
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const [pendingDelete,setPendingDelete]=useState(null);
  const [deleting,setDeleting]=useState(null);
  const [revision,setRevision]=useState(0);

  useEffect(()=>{
    let alive=true;
    const load=async()=>{
      setLoading(true);setError('');
      try {
        const {data:user}=await getCurrentUser();
        if(!user?.id)throw new Error('Sem usuário autenticado');
        const response=await getDiaryLogs(user.id,dayKey());
        if(!alive)return;
        const items=Array.isArray(response.data)?response.data:[];
        setLogs([...items].sort((a,b)=>(safe(b.timestamp)||0)-(safe(a.timestamp)||0)));
      }catch{
        if(alive)setError('Não foi possível carregar seus registros. Tente novamente.');
      }finally{if(alive)setLoading(false);}
    };
    load();
    return()=>{alive=false};
  },[revision]);

  const visible=useMemo(()=>logs.filter(row=>matches(row,filter)),[logs,filter]);
  const food=useMemo(()=>summarizeDay(logs),[logs]);
  const movements=logs.filter(row=>['cardio','exercise'].includes(row.type)).length;

  const remove=async id=>{
    if(deleting!==null)return;
    setDeleting(id);setError('');setMessage('');
    try {
      await deleteDiaryLog(id);
      setLogs(items=>items.filter(row=>row.id!==id));
      setPendingDelete(null);
      setMessage('Registro excluído.');
    }catch{
      setError('Não foi possível excluir. O registro permanece no diário.');
    }finally{setDeleting(null);}
  };
  return <main className="gg-records">
    <div className="gg-records-inner">
      <header className="gg-records-heading">
        <Link to="/" className="gg-records-back"><FiArrowLeft aria-hidden="true"/> HOJE</Link>
        <span className="gg-records-eyebrow"><FiCalendar aria-hidden="true"/> SEUS LANÇAMENTOS / HOJE</span>
        <h1>REGISTROS<span>.</span></h1>
        <p>O que você fez e consumiu hoje, sem misturar os totais.</p>
      </header>
      {message&&<p className="gg-records-message" role="status">{message}</p>}
      {error&&<div className="gg-records-error" role="alert">{error}
        {loading===false&&logs.length===0&&<button onClick={()=>setRevision(n=>n+1)} type="button"><FiRefreshCw aria-hidden="true"/> TENTAR NOVAMENTE</button>}
      </div>}
      {!loading&&<>
        <section className="gg-records-summary" aria-label="Resumo dos registros de hoje">
          <div><FiCoffee aria-hidden="true"/><span>ALIMENTAÇÃO</span><strong>{number(food.calories)} <small>kcal</small></strong></div>
          <div><FiDroplet aria-hidden="true"/><span>ÁGUA</span><strong>{number(food.water)} <small>ml</small></strong></div>
          <div><FiActivity aria-hidden="true"/><span>MOVIMENTO</span><strong>{movements} <small>atividade{movements!==1?'s':''}</small></strong></div>
        </section>
        <nav className="gg-records-filters" aria-label="Filtrar registros de hoje">
          {types.map(type=><button key={type.value} type="button"
            aria-pressed={filter===type.value} onClick={()=>{setFilter(type.value);setPendingDelete(null);}}>
            {type.label}</button>)}
        </nav>
        {visible.length===0?<div className="gg-records-empty">
          <strong>{logs.length===0?'NENHUM REGISTRO AINDA.':'NENHUM REGISTRO NESTA CATEGORIA.'}</strong>
          <p>Adicione uma refeição, água ou atividade para começar.</p>
          <Link to="/alimentacao">ABRIR ALIMENTAÇÃO</Link>
        </div>:
        <ul className="gg-records-list">
          {visible.map(log=>{
            const Icon=icons[log.type]||FiActivity;
            const label=log.name || ({water:'Água',cardio:'Cardio',exercise:'Treino'}[log.type]||'Registro');
            const confirm=pendingDelete===log.id;
            const metrics=[
              log.type==='water'?number(safe(log.volume))+' ml': log.calories!=null ? number(safe(log.calories))+' kcal' : null,
              log.durationSeconds!=null ? timeMeta(log.durationSeconds):null,
              log.distanceKm!=null?number(safe(log.distanceKm))+' km':null
            ].filter(Boolean).join(' · ');
            return <li key={log.id} className="gg-records-row">
              <div className="gg-records-entry">
                <span className={'gg-records-icon '+(log.type||'')}><Icon aria-hidden="true"/></span>
                <div className="gg-records-copy"><strong>{label}</strong><small>{metrics}</small></div>
                <button type="button" className="gg-records-delete" disabled={deleting!==null}
                  aria-label={'Remover '+label} onClick={()=>{setPendingDelete(log.id);setMessage('');}}>
                  <FiTrash2 aria-hidden="true"/>
                </button>
              </div>
              {confirm&&<div className="gg-records-confirm" role="group" aria-label={'Excluir '+label}>
                <span>Excluir este registro?</span>
                <div>
                  <button type="button" aria-label="Cancelar exclusão" onClick={()=>setPendingDelete(null)}><FiX aria-hidden="true"/> CANCELAR</button>
                  <button type="button" aria-label="Confirmar exclusão" disabled={deleting!==null}
                    onClick={()=>remove(log.id)}><FiCheck aria-hidden="true"/> {deleting===log.id?'EXCLUINDO…':'EXCLUIR'}</button>
                </div>
              </div>}
            </li>;
          })}
        </ul>}
        <div className="gg-records-bottom">
          <Link to="/historico"><FiClock aria-hidden="true"/> VER HISTÓRICO</Link>
          <Link to="/alimentacao"><FiCoffee aria-hidden="true"/> REGISTRAR ALIMENTO</Link>
        </div>
      </>}
      {loading&&<p className="gg-records-loading" role="status">Carregando registros…</p>}
    </div>
  </main>;
}
