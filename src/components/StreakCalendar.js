import React,{useEffect,useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GiFlame} from 'react-icons/gi';
import {FiChevronDown} from 'react-icons/fi';
import {getDiaryLogs} from '../services/apiService';
import {dayKey} from '../utils/nutrition';
import {activeDay,computeStreak} from '../utils/streak';
import './StreakCalendar.css';

export default function StreakCalendar({userId,todayLogs,compact=false}){
 const {t,i18n}=useTranslation();
 const locale=i18n.resolvedLanguage==='pt'?'pt-BR':i18n.resolvedLanguage||'pt-BR';
 const [days,setDays]=useState(null),[open,setOpen]=useState(false);
 useEffect(()=>{
   if(!userId){setDays(null);return undefined;}
   let live=true;
   const now=new Date();
   const dates=Array.from({length:7},(_,i)=>new Date(now.getFullYear(),now.getMonth(),now.getDate()-i,12));
   Promise.allSettled(dates.map((date,i)=>i===0&&Array.isArray(todayLogs)?Promise.resolve({data:todayLogs}):getDiaryLogs(userId,dayKey(date)))).then(items=>{
     if(live)setDays(items.map((item,i)=>({key:dayKey(dates[i]),date:dates[i],known:item.status==='fulfilled',activity:item.status==='fulfilled'&&activeDay(item.value.data)})));
   });
   return()=>{live=false};
 },[userId,todayLogs]);
 const reliable=days?.every(x=>x.known);
 const streak=reliable?computeStreak(days.map(x=>x.activity)):null;
 return <section className={'gg27-streak'+(compact?' compact':'')+(open?' is-expanded':'')} aria-label={t('today.streakLabel')}>
   <button type="button" className="gg27-streak-button" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
     <span className="gg27-flame" aria-hidden="true"><GiFlame className="gg27-flame-icon"/></span>
     <span className="gg27-streak-copy"><strong>{streak?t(streak.days===1?'today.streakOne':'today.streakMany',{days:streak.days+(streak.capped?'+':'')}):t('today.streakTitle')}</strong>
       <small>{streak?.atRisk?t('today.streakRisk'):t('today.streakTap')}</small></span>
     <FiChevronDown className={open?'opened':''} aria-hidden="true"/>
   </button>
   {open&&<div className="gg27-calendar">
     <strong>{t('today.streakWeek')}</strong>
     {days?<div className="gg27-calendar-week">{days.slice().reverse().map(x=><div key={x.key} className={'gg27-calendar-day '+(!x.known?'unknown':x.activity?'marked':'unmarked')} title={!x.known?t('today.streakUnknown'):x.activity?t('today.streakMarked'):t('today.streakUnmarked')}>
       <small>{new Intl.DateTimeFormat(locale,{weekday:'short'}).format(x.date).replace('.','')}</small><b>{x.date.getDate()}</b>
     </div>)}</div>:<p>{t('today.streakLoading')}</p>}
     <p>{t('today.streakNote')}</p>
   </div>}
 </section>;
}
