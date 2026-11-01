import React,{useEffect,useState} from 'react';
import {FaFire} from 'react-icons/fa';
import {FiChevronDown} from 'react-icons/fi';
import {getDiaryLogs} from '../services/apiService';
import {dayKey} from '../utils/nutrition';
import {activeDay,computeStreak} from '../utils/streak';
import './StreakCalendar.css';

export default function StreakCalendar({userId,todayLogs,compact=false}){
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
 return <section className={'gg27-streak'+(compact?' compact':'')} aria-label="Calendário da constância">
   <button type="button" className="gg27-streak-button" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
     <span className="gg27-flame" aria-hidden="true"><FaFire/></span>
     <span className="gg27-streak-copy"><strong>{streak?streak.days+(streak.capped?'+':'')+' DIA'+(streak.days!==1?'S':''):'SUA CONSTÂNCIA'}</strong>
       <small>{streak?.atRisk?'Registre hoje para manter a sequência':'Toque para ver seus dias'}</small></span>
     <FiChevronDown className={open?'opened':''} aria-hidden="true"/>
   </button>
   {open&&<div className="gg27-calendar">
     <strong>ÚLTIMOS 7 DIAS</strong>
     {days?<div className="gg27-calendar-week">{days.slice().reverse().map(x=><div key={x.key} className={'gg27-calendar-day '+(!x.known?'unknown':x.activity?'marked':'unmarked')} title={!x.known?'Indisponível':x.activity?'Registro realizado':'Sem registro'}>
       <small>{new Intl.DateTimeFormat('pt-BR',{weekday:'short'}).format(x.date).replace('.','')}</small><b>{x.date.getDate()}</b>
     </div>)}</div>:<p>Consultando registros…</p>}
     <p>Marcação laranja: alimentação, água ou atividade registrada. Só abrir o aplicativo não conta. Falha de conexão não é falta.</p>
   </div>}
 </section>;
}
