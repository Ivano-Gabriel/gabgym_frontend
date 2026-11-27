import React,{useEffect,useState} from 'react';
import {useTranslation} from 'react-i18next';
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
     <span className="gg27-flame" aria-hidden="true"><svg className="gg27-flame-icon" viewBox="0 0 48 56" fill="none" aria-hidden="true"><path d="M27 3c3 12-6 15-1 23 3-2 7-6 7-11 7 7 12 15 12 24a21 21 0 0 1-42 0c0-10 7-18 14-24-1 7 1 11 4 13 4-8 2-14 6-25Z" fill="#ef3447"/><path d="M26 29c1 7-5 9-3 14 3-1 5-4 6-7 4 5 5 8 5 11a10 10 0 0 1-20 0c0-6 5-11 12-18Z" fill="#ffb1a2"/><path d="M9 35c1-5 4-9 7-12" stroke="#ff8d8d" strokeWidth="2" strokeLinecap="round"/></svg></span>
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
