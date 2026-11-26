import React,{useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FiActivity,FiArrowLeft,FiClock,FiCoffee,FiDroplet,FiRefreshCw,FiTrash2,FiX,FiCheck,FiCalendar} from 'react-icons/fi';
import {getCurrentUser,getDiaryLogs,deleteDiaryLog} from '../services/apiService';
import {dayKey,summarizeDay} from '../utils/nutrition';
import './RegistrosPage.css';

const icons={food:FiCoffee,water:FiDroplet,cardio:FiActivity,exercise:FiActivity};
const types=['all','food','movement','water'];
const matches=(row,filter)=>filter==='all'||row.type===filter||
  (filter==='movement'&&['cardio','exercise'].includes(row.type));
const safe=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,n):0;};
const timeMeta=seconds=>{
  const s=safe(seconds),min=Math.floor(s/60);
  return min ? min+' min' : s ? Math.round(s)+' s' : null;
};
export default function RegistrosPage(){
  const {t,i18n}=useTranslation();
  const locale=i18n.resolvedLanguage==='pt'?'pt-BR':i18n.resolvedLanguage||'pt-BR';
  const number=value=>Number(value).toLocaleString(locale,{maximumFractionDigits:1});
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
        if(alive)setError('journal.recordsError');
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
      setMessage('journal.deleted');
    }catch{
      setError('journal.deleteError');
    }finally{setDeleting(null);}
  };
  return <main className="gg-records">
    <div className="gg-records-inner">
      <header className="gg-records-heading">
        <Link to="/" className="gg-records-back"><FiArrowLeft aria-hidden="true"/> {t('journal.today')}</Link>
        <span className="gg-records-eyebrow"><FiCalendar aria-hidden="true"/> {t('journal.recordsKicker')}</span>
        <h1>{t('journal.recordsTitle')}<span>.</span></h1>
        <p>{t('journal.recordsIntro')}</p>
      </header>
      {message&&<p className="gg-records-message" role="status">{t(message)}</p>}
      {error&&<div className="gg-records-error" role="alert">{t(error)}
        {loading===false&&logs.length===0&&<button onClick={()=>setRevision(n=>n+1)} type="button"><FiRefreshCw aria-hidden="true"/> {t('journal.retry')}</button>}
      </div>}
      {!loading&&<>
        <section className="gg-records-summary" aria-label={t('journal.todaySummary')}>
          <div><FiCoffee aria-hidden="true"/><span>{t('journal.food')}</span><strong>{number(food.calories)} <small>kcal</small></strong></div>
          <div><FiDroplet aria-hidden="true"/><span>{t('journal.water')}</span><strong>{number(food.water)} <small>ml</small></strong></div>
          <div><FiActivity aria-hidden="true"/><span>{t('journal.movement')}</span><strong>{movements} <small>{t(movements===1?'journal.activity_one':'journal.activity_other')}</small></strong></div>
        </section>
        <nav className="gg-records-filters" aria-label={t('journal.filterLabel')}>
          {types.map(type=><button key={type} type="button"
            aria-pressed={filter===type} onClick={()=>{setFilter(type);setPendingDelete(null);}}>
            {t('journal.filter_'+type)}</button>)}
        </nav>
        {visible.length===0?<div className="gg-records-empty">
          <strong>{logs.length===0?t('journal.emptyAll'):t('journal.emptyFilter')}</strong>
          <p>{t('journal.emptyHelp')}</p>
          <Link to="/alimentacao">{t('journal.openFood')}</Link>
        </div>:
        <ul className="gg-records-list">
          {visible.map(log=>{
            const Icon=icons[log.type]||FiActivity;
            const label=log.name || t(({water:'journal.waterName',cardio:'nav.cardio',exercise:'journal.workoutName'}[log.type]||'journal.recordName'));
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
                  aria-label={t('journal.remove',{label})} onClick={()=>{setPendingDelete(log.id);setMessage('');}}>
                  <FiTrash2 aria-hidden="true"/>
                </button>
              </div>
              {confirm&&<div className="gg-records-confirm" role="group" aria-label={t('journal.deleteLabel',{label})}>
                <span>{t('journal.deleteQuestion')}</span>
                <div>
                  <button type="button" aria-label={t('journal.cancelDelete')} onClick={()=>setPendingDelete(null)}><FiX aria-hidden="true"/> {t('journal.cancel')}</button>
                  <button type="button" aria-label={t('journal.confirmDelete')} disabled={deleting!==null}
                    onClick={()=>remove(log.id)}><FiCheck aria-hidden="true"/> {deleting===log.id?t('journal.deleting'):t('journal.delete')}</button>
                </div>
              </div>}
            </li>;
          })}
        </ul>}
        <div className="gg-records-bottom">
          <Link to="/historico"><FiClock aria-hidden="true"/> {t('journal.viewHistory')}</Link>
          <Link to="/alimentacao"><FiCoffee aria-hidden="true"/> {t('journal.registerFood')}</Link>
        </div>
      </>}
      {loading&&<p className="gg-records-loading" role="status">{t('journal.recordsLoading')}</p>}
    </div>
  </main>;
}
