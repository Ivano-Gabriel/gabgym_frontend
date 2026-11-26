import React, {useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FiArrowLeft,FiActivity,FiCalendar,FiChevronDown,FiCoffee,FiDroplet,FiRefreshCw} from 'react-icons/fi';
import {getCurrentUser,getDiaryLogs} from '../services/apiService';
import {buildRecentDays,summarizeHistoryDay} from '../utils/historyUtils';
import PremiumPhoto from '../components/PremiumPhoto';
import './HistoryPage.css';

export default function HistoryPage(){
  const {t,i18n}=useTranslation();
  const locale=i18n.resolvedLanguage==='pt'?'pt-BR':i18n.resolvedLanguage||'pt-BR';
  const fmt=n=>Number(n).toLocaleString(locale,{maximumFractionDigits:1});
  const [days,setDays]=useState([]);
  const [selected,setSelected]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [revision,setRevision]=useState(0);

  useEffect(()=>{
    let alive=true;
    const load=async()=>{
      setLoading(true);setError('');
      try{
        const {data:user}=await getCurrentUser();
        if(!user?.id) throw new Error('Sem usuário');
        const week=buildRecentDays();
        const results=await Promise.allSettled(week.map(day=>getDiaryLogs(user.id,day.key)));
        if(!alive)return;
        const rows=week.map((day,index)=>({
          ...day,
          status:results[index].status==='fulfilled'?'loaded':'error',
          logs:results[index].status==='fulfilled' && Array.isArray(results[index].value.data)
            ? results[index].value.data : []
        }));
        setDays(rows);
        setSelected(old=>rows.some(d=>d.key===old)?old:rows[0].key);
        if(rows.every(d=>d.status==='error'))setError('journal.weekError');
      }catch{
        if(alive)setError('journal.historyError');
      }finally{if(alive)setLoading(false);}
    };
    load();
    return()=>{alive=false;};
  },[revision]);
  const summary=useMemo(()=>{
    const loaded=days.filter(day=>day.status==='loaded');
    return loaded.reduce((total,day)=>{
      const x=summarizeHistoryDay(day.logs);
      total.calories+=x.calories;
      total.water+=x.water;
      total.distanceKm+=x.distanceKm;
      total.activities+=x.activities;
      return total;
    },{calories:0,water:0,distanceKm:0,activities:0});
  },[days]);
  const successful=days.filter(x=>x.status==='loaded').length;

  return <main className="gg-history">
    <div className="gg-history-inner">
      <header className="gg-history-heading gg-photo-hero">
        <PremiumPhoto scene="gym" decorative priority />
        <Link to="/perfil" className="gg-history-back"><FiArrowLeft aria-hidden="true"/> {t('journal.profile')}</Link>
        <span className="gg-history-eyebrow"><FiCalendar aria-hidden="true"/> {t('journal.historyKicker')}</span>
        <h1>{t('journal.historyTitle')}<span>.</span></h1>
        <p>{t('journal.historyIntro')}</p>
      </header>
      {loading&&<p className="gg-history-loading" role="status">{t('journal.historyLoading')}</p>}
      {error&&<div className="gg-history-error" role="alert">{t(error)}
        <button type="button" onClick={()=>setRevision(x=>x+1)}><FiRefreshCw aria-hidden="true"/> {t('journal.retry')}</button>
      </div>}
      {!loading&&successful>0&&<>
        <section className="gg-history-week" aria-label={t('journal.weekLabel')}>
          <div className="gg-history-week-head">
            <span>{t('journal.weekHeading')}</span>
            {successful<7&&<small>{t('journal.daysLoaded',{count:successful})}</small>}
          </div>
          <div className="gg-history-stats">
            <div><FiCoffee aria-hidden="true"/><span>{t('journal.food')}</span><strong>{fmt(summary.calories)} <small>kcal</small></strong></div>
            <div><FiDroplet aria-hidden="true"/><span>{t('journal.water')}</span><strong>{fmt(summary.water)} <small>ml</small></strong></div>
            <div><FiActivity aria-hidden="true"/><span>{t('journal.cardio')}</span><strong>{fmt(summary.distanceKm)} <small>km</small></strong></div>
          </div>
          <p>{t('journal.weekNote')}</p>
        </section>
        <section className="gg-history-days" aria-label={t('journal.historyDays')}>
          <div className="gg-history-section-title"><span>{t('journal.historyDetails')}</span><h2>{t('journal.yourRecords')}</h2></div>
          {days.map(day=>{
            const total=summarizeHistoryDay(day.logs);
            const isOpen=selected===day.key;
            return <article key={day.key} className={'gg-history-day'+(isOpen?' active':'')}>
              <button type="button" className="gg-history-day-toggle"
                aria-expanded={isOpen} aria-controls={'gg-history-day-'+day.key}
                onClick={()=>setSelected(isOpen?null:day.key)}>
                <span className="gg-history-date"><strong>{day.label==='Hoje'?t('nav.today'):day.label==='Ontem'?t('journal.yesterday'):new Intl.DateTimeFormat(locale,{weekday:'short'}).format(new Date(day.key+'T12:00:00')).replace('.','')}</strong><small>{new Intl.DateTimeFormat(locale,{day:'2-digit',month:'short'}).format(new Date(day.key+'T12:00:00')).replace('.','')}</small></span>
                <span className="gg-history-day-total">{day.status==='error'
                  ? t('journal.dayErrorShort')
                  : total.entries ? fmt(total.calories)+' kcal · '+fmt(total.water)+' ml'
                  : t('journal.noRecords')}</span>
                <FiChevronDown aria-hidden="true" className={isOpen?'rotated':''}/>
              </button>
              {isOpen&&<div className="gg-history-day-body" id={'gg-history-day-'+day.key}>
                {day.status==='error'
                  ? <p>{t('journal.dayError')}</p>
                  : total.entries===0
                  ? <p>{t('journal.dayEmpty')}</p>
                  : <>
                    <div className="gg-history-day-metrics">
                      <div><span>{t('journal.food')}</span><b>{fmt(total.calories)} kcal</b></div>
                      <div><span>{t('journal.water')}</span><b>{fmt(total.water)} ml</b></div>
                      <div><span>{t('journal.movement')}</span><b>{fmt(total.movementCalories)} {t('journal.estimatedKcal')}</b></div>
                    </div>
                    <ul className="gg-history-loglist">
                      {day.logs.map((log,i)=><li key={log.id||i}>
                        <span>{log.name||t(({water:'journal.waterName',cardio:'nav.cardio',exercise:'journal.workoutName'}[log.type]||'journal.recordName'))}</span>
                        <small>{log.type==='water'?fmt(Math.max(0,Number(log.volume)||0))+' ml':fmt(Math.max(0,Number(log.calories)||0))+' kcal'}</small>
                      </li>)}
                    </ul>
                  </>}
              </div>}
            </article>;
          })}
        </section>
        <div className="gg-history-actions">
          <Link to="/registros">{t('journal.todayRecords')}</Link>
          <Link to="/">{t('journal.backToday')}</Link>
        </div>
      </>}
    </div>
  </main>;
}
