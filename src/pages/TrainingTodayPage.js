import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiArrowRight, FiBookOpen, FiClock, FiCompass, FiMapPin, FiTrendingUp, FiZap, FiTarget } from 'react-icons/fi';
import { getCurrentUser, getDiaryLogs, addDiaryLog } from '../services/apiService';
import { dayKey, calorieProgress } from '../utils/nutrition';
import PremiumPhoto from '../components/PremiumPhoto';
import WorkoutPlanner from '../components/WorkoutPlanner';
import {useExperience} from '../context/ExperienceContext';
import {useTranslation} from 'react-i18next';
import './TrainingTodayPage.css';

const positive = value => { const n=Number(value); return Number.isFinite(n)&&n>0?n:0; };

/** Consumo alimentar e agua nunca contam como gasto de exercício. */
export const summarizeMovement = logs => {
  const entries=(Array.isArray(logs)?logs:[]).filter(item => ['cardio','exercise'].includes(item.type));
  return {
    entries,
    calories: Math.round(entries.reduce((sum,item)=>sum+positive(item.calories),0)),
    durationSeconds: Math.round(entries.reduce((sum,item)=>sum+positive(item.durationSeconds),0)),
    distanceKm: Math.round(entries.filter(item=>item.type==='cardio').reduce((sum,item)=>sum+positive(item.distanceKm),0)*100)/100
  };
};

export default function TrainingTodayPage(){
  const {settings}=useExperience();
  const {t,i18n}=useTranslation();
  const simple=settings.mode==='simple';
  const locale=i18n.resolvedLanguage==='pt'?'pt-BR':i18n.resolvedLanguage||'pt-BR';
  const format=value=>Number(value).toLocaleString(locale,{maximumFractionDigits:1});
  const mutationLock=useRef(false);
  const [logs,setLogs]=useState([]);
  const [user,setUser]=useState(null);
  const [showWorkout,setShowWorkout]=useState(false);
  const [showPlanner,setShowPlanner]=useState(false);
  const [workout,setWorkout]=useState({name:'Costas e bíceps',exercise:'',sets:'',reps:'',minutes:'45',calories:''});
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [burnGoal,setBurnGoal]=useState('');
  const [sessionGoal,setSessionGoal]=useState('');
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [revision,setRevision]=useState(0);
  useEffect(()=>{
    let alive=true;
    setLoading(true);setError('');
    const load=async()=>{
      try{
        const {data:user}=await getCurrentUser();
        if(!user?.id) throw new Error('Não autenticado');
        if(alive) {
          setUser(user);
          try{
            setBurnGoal(localStorage.getItem('gabgym:burn-goal:'+user.id)||'');
            setSessionGoal(localStorage.getItem('gabgym:session-goal:'+user.id)||'');
          }catch{}
        }
        const response=await getDiaryLogs(user.id,dayKey());
        if(alive)setLogs(Array.isArray(response.data)?response.data:[]);
      }catch{
        if(alive)setError('training.loadError');
      }finally{ if(alive)setLoading(false); }
    };
    load();
    return()=>{alive=false;};
  },[revision]);
  const today=useMemo(()=>summarizeMovement(logs),[logs]);
  const workoutsDone=today.entries.filter(item=>item.type==='exercise').length;
  const sessionTarget=Number(sessionGoal)>=1&&Number(sessionGoal)<=20?Number(sessionGoal):1;
  const sessionProgress=calorieProgress(workoutsDone,sessionTarget);
  const validBurnGoal=Number(burnGoal)>=30 && Number(burnGoal)<=3000 ? Number(burnGoal):null;
  const burnProgress=validBurnGoal?calorieProgress(today.calories,validBurnGoal):null;
  const saveSessionGoal=value=>{
    setSessionGoal(value);
    if(user?.id&&(value===''||(Number(value)>=1&&Number(value)<=20)))localStorage.setItem('gabgym:session-goal:'+user.id,value);
  };
  const saveGoal=value=>{
    setBurnGoal(value);
    if(user?.id && (value==='' || (Number(value)>=30 && Number(value)<=3000)))
      localStorage.setItem('gabgym:burn-goal:'+user.id,value);
  };
  const saveWorkout=async event=>{
    event.preventDefault();
    if(!user?.id||mutationLock.current||loading)return;
    const minutes=Number(workout.minutes);
    const kcal=simple||workout.calories===''?0:Number(workout.calories);
    const name=workout.name.trim();
    const exercise=simple?'':workout.exercise.trim();
    const sets=simple||workout.sets===''?null:Number(workout.sets),reps=simple||workout.reps===''?null:Number(workout.reps);
    if(name.length<3||name.length>60||!Number.isFinite(minutes)||minutes<1||minutes>600||
      !Number.isFinite(kcal)||kcal<0||kcal>3000||exercise.length>60||
      (sets!==null&&(!Number.isInteger(sets)||sets<1||sets>30))||
      (reps!==null&&(!Number.isInteger(reps)||reps<1||reps>100))){
      setMessage('training.invalid');
      return;
    }
    mutationLock.current=true;setBusy(true);setMessage('');
    try{
      await addDiaryLog({
        userId:user.id,type:'exercise',name:name+(exercise?' · '+exercise:'')+(sets&&reps?' · '+sets+'x'+reps:'')+' ('+minutes+' min)',
        calories:Math.round(kcal),logDate:dayKey(),timestamp:Date.now()
      });
      setShowWorkout(false);
      try{
        const response=await getDiaryLogs(user.id,dayKey());
        setLogs(Array.isArray(response.data)?response.data:[]);
        setMessage('training.saved');
      }catch{
        setMessage('training.refreshError');
      }
    }catch{setMessage('training.saveError');}
    finally{mutationLock.current=false;setBusy(false);}
  };
  return (
    <main className="gg-movement">
      <div className="gg-movement-inner">
        <header className="gg-movement-hero gg-photo-hero">
          <PremiumPhoto scene="strength" decorative priority />
          <span className="gg-movement-kicker"><FiActivity aria-hidden="true"/> {t('training.kicker')}</span>
          <h1>{simple?t('training.title'):<>{t('training.title')} <em>+</em> CARDIO</>}<span>.</span></h1>
          <p>{t('training.subtitle')}</p>
        </header>
        {!simple&&<section className="gg-movement-day" aria-labelledby="gg-movement-today">
          <div className="gg-movement-day-title">
            <div><span>{t('training.progress')}</span><h2 id="gg-movement-today">{t('journal.today')}.</h2></div>
            <Link to="/historico">{t('journal.viewHistory')} <FiArrowRight aria-hidden="true"/></Link>
          </div>
          {loading?<p className="gg-movement-message" role="status">{t('training.loading')}</p>:error?
            <p className="gg-movement-message gg-movement-error" role="alert">{t(error)}</p>:
            <>
              <div className="gg-movement-stats">
                <div><FiZap aria-hidden="true"/><span>{t('training.energy')}</span><strong>{format(today.calories)} <small>kcal</small></strong></div>
                <div><FiClock aria-hidden="true"/><span>{t('training.logged')}</span><strong>{workoutsDone} <small>{t('training.unit')}</small></strong></div>
                <div><FiMapPin aria-hidden="true"/><span>{t('training.distance')}</span><strong>{today.distanceKm?format(today.distanceKm):"—"} <small>km</small></strong></div>
              </div>
              {today.entries.length ?
                <div className="gg-movement-last">
                  <FiTrendingUp aria-hidden="true"/>
                  <span>{t('training.entries',{count:today.entries.length})}</span>
                </div>:
                <p className="gg-movement-empty">{t('training.empty')}</p>}
            </>
          }
          {!loading&&!error&&<div className="gg-movement-meters">
            <div><div className="gg-movement-meter-head"><strong>{t('training.dayWorkout')}</strong><span>{workoutsDone+' / '+sessionTarget+' '+t('training.records')}</span></div>
              <div className="gg-movement-meter" role="progressbar" aria-label={t('training.done')} aria-valuenow={Math.min(workoutsDone,sessionTarget)} aria-valuemin="0" aria-valuemax={sessionTarget}>
                <span style={{width:sessionProgress.percent+'%'}} /></div><label className="gg-movement-goal-label">{t('training.sessionGoal')}<input type="number" min="1" max="20" placeholder="1" value={sessionGoal} inputMode="numeric" onChange={e=>saveSessionGoal(e.target.value)}/></label></div>
            <div><div className="gg-movement-meter-head"><strong>{t('training.energy')}</strong><span>{validBurnGoal?format(today.calories)+' / '+format(validBurnGoal)+' kcal':t('training.noReference')}</span></div>
              {burnProgress&&<div className="gg-movement-meter" role="progressbar" aria-label={t('training.energyProgress')} aria-valuenow={Math.min(today.calories,validBurnGoal)} aria-valuemin="0" aria-valuemax={validBurnGoal}>
                <span style={{width:burnProgress.percent+'%'}}/></div>}
              <label className="gg-movement-goal-label">{t('training.reference')}
                <input type="number" min="30" max="3000" placeholder={t('training.referencePlaceholder')}
                  value={burnGoal} onChange={e=>saveGoal(e.target.value)} inputMode="numeric"/>
              </label></div>
          </div>}
          <p className="gg-movement-note">{t('training.note')}</p>
        </section>}
        {simple&&(loading?<p role="status">{t('training.loading')}</p>:error?<p role="alert">{t(error)}</p>:<p className="gg-simple-module-summary">{t('training.simpleCount',{count:workoutsDone})}</p>)}
        <section className="gg-movement-actions" aria-labelledby="gg-movement-start">
          <div className="gg-movement-section-heading"><span>{t('training.action')}</span><h2 id="gg-movement-start">{t('training.choose')}</h2></div>
          {!simple&&<div className="gg-movement-planner-entry">
            <button type="button" className="gg-movement-primary gg-movement-workout-toggle"
              aria-expanded={showPlanner} disabled={loading||!user||busy} aria-label={t('training.plannerOpen')}
              onClick={()=>setShowPlanner(value=>!value)}>
              <span className="gg-movement-action-icon"><FiActivity aria-hidden="true"/></span>
              <span><strong>{t('training.planner')}</strong><small>{t('training.plannerDetail')}</small></span>
              <FiArrowRight aria-hidden="true"/>
            </button>
            {showPlanner&&user?.id&&<WorkoutPlanner userId={user.id} onSaved={async()=>{
              const result=await getDiaryLogs(user.id,dayKey());
              if(Array.isArray(result.data))setLogs(result.data);
            }}/>}
          </div>}
          <button type="button" className="gg-movement-primary gg-movement-workout-toggle" aria-expanded={showWorkout} disabled={loading||!user||busy}
            onClick={()=>setShowWorkout(!showWorkout)} aria-label={t('training.log')}>
            <span className="gg-movement-action-icon"><FiActivity aria-hidden="true"/></span>
            <span><strong>{t('training.logTitle')}</strong><small>{simple?t('training.simpleHint'):t('training.fullHint')}</small></span>
            <FiArrowRight aria-hidden="true"/>
          </button>
          {showWorkout&&<form className="gg-movement-workout-form" onSubmit={saveWorkout}>
            <label>{t('training.type')}
              <select value={workout.name} onChange={e=>setWorkout({...workout,name:e.target.value})}>
                {[["Costas e bíceps","backBiceps"],["Peito e tríceps","chestTriceps"],["Pernas","legs"],["Ombros","shoulders"],["Superior","upper"],["Inferior","lower"],["Corpo inteiro","full"]].map(([name,key])=><option key={name} value={name}>{t('training.'+key)}</option>)}
              </select>
            </label>
            {!simple&&<><label>{t('training.exercise')}<input type="text" maxLength="60" value={workout.exercise} placeholder={t('training.exerciseExample')} onChange={e=>setWorkout({...workout,exercise:e.target.value})}/></label>
             <label>{t('training.sets')}<input type="number" min="1" max="30" value={workout.sets} onChange={e=>setWorkout({...workout,sets:e.target.value})}/></label>
             <label>{t('training.reps')}<input type="number" min="1" max="100" value={workout.reps} onChange={e=>setWorkout({...workout,reps:e.target.value})}/></label></>}
             <label>{t('training.minutes')}
              <input type="number" min="1" max="600" value={workout.minutes} onChange={e=>setWorkout({...workout,minutes:e.target.value})} inputMode="numeric"/>
            </label>
            {!simple&&<><label>{t('training.calories')}
              <input type="number" min="0" max="3000" value={workout.calories} onChange={e=>setWorkout({...workout,calories:e.target.value})} placeholder={t('training.caloriesHint')} inputMode="numeric"/>
            </label>
            <p>{t('training.formNote')}</p></>}
            <button type="submit" disabled={busy} className="gg-movement-save-workout">{busy?t('training.saving'):t('training.save')}</button>
          </form>}
          {error&&<button type="button" className="gg-movement-secondary" disabled={loading||busy} onClick={()=>setRevision(x=>x+1)}>{t('journal.retry')}</button>}
          {message&&<p className="gg-movement-message" role="status">{t(message)}</p>}
          <Link className="gg-movement-primary" to="/cardio/select" aria-label={t('training.cardio')}>
            <span className="gg-movement-action-icon"><FiActivity aria-hidden="true"/></span>
            <span><strong>{t('training.cardioTitle')}</strong><small>{t('training.cardioHint')}</small></span>
            <FiArrowRight aria-hidden="true"/>
          </Link>
          {!simple&&<><Link className="gg-movement-secondary" to="/routine-generator" aria-label={t('training.routine')}>
            <FiTarget aria-hidden="true"/><span><strong>{t('training.routineTitle')}</strong><small>{t('training.routineHint')}</small></span><FiArrowRight aria-hidden="true"/>
          </Link>
          <Link className="gg-movement-secondary" to="/exercise-library" aria-label={t('training.library')}>
            <FiBookOpen aria-hidden="true"/><span><strong>{t('training.libraryTitle')}</strong><small>{t('training.libraryHint')}</small></span><FiArrowRight aria-hidden="true"/>
          </Link></>}
        </section>
        <div className="gg-movement-bottom"><FiCompass aria-hidden="true"/> {t('nav.consistency')}</div>
      </div>
    </main>
  );
}
