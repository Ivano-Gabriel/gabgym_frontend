import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiArrowRight, FiBookOpen, FiClock, FiCompass, FiMapPin, FiTrendingUp, FiZap, FiTarget } from 'react-icons/fi';
import { getCurrentUser, getDiaryLogs, addDiaryLog } from '../services/apiService';
import { dayKey, calorieProgress } from '../utils/nutrition';
import './TrainingTodayPage.css';

const format = value => Number(value).toLocaleString('pt-BR',{maximumFractionDigits:1});
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
  const [logs,setLogs]=useState([]);
  const [user,setUser]=useState(null);
  const [showWorkout,setShowWorkout]=useState(false);
  const [workout,setWorkout]=useState({name:'Costas e bíceps',minutes:'45',calories:''});
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [burnGoal,setBurnGoal]=useState('');
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{
    let alive=true;
    const load=async()=>{
      try{
        const {data:user}=await getCurrentUser();
        if(!user?.id) throw new Error('Não autenticado');
        if(alive) {
          setUser(user);
          setBurnGoal(localStorage.getItem('gabgym:burn-goal:'+user.id)||'');
        }
        const response=await getDiaryLogs(user.id,dayKey());
        if(alive)setLogs(Array.isArray(response.data)?response.data:[]);
      }catch{
        if(alive)setError('Não foi possível carregar o movimento de hoje. Seu histórico continua salvo.');
      }finally{ if(alive)setLoading(false); }
    };
    load();
    return()=>{alive=false;};
  },[]);
  const today=useMemo(()=>summarizeMovement(logs),[logs]);
  const workoutsDone=today.entries.filter(item=>item.type==='exercise').length;
  const validBurnGoal=Number(burnGoal)>=30 && Number(burnGoal)<=3000 ? Number(burnGoal):null;
  const burnProgress=validBurnGoal?calorieProgress(today.calories,validBurnGoal):null;
  const saveGoal=value=>{
    setBurnGoal(value);
    if(user?.id && (value==='' || (Number(value)>=30 && Number(value)<=3000)))
      localStorage.setItem('gabgym:burn-goal:'+user.id,value);
  };
  const saveWorkout=async event=>{
    event.preventDefault();
    if(!user?.id||busy)return;
    const minutes=Number(workout.minutes);
    const kcal=workout.calories===''?0:Number(workout.calories);
    const name=workout.name.trim();
    if(name.length<3||name.length>60||!Number.isFinite(minutes)||minutes<1||minutes>600||
      !Number.isFinite(kcal)||kcal<0||kcal>3000){
      setMessage('Confira treino, duração e a estimativa opcional de calorias.');
      return;
    }
    setBusy(true);setMessage('');
    try{
      await addDiaryLog({
        userId:user.id,type:'exercise',name:name+' ('+minutes+' min)',
        calories:Math.round(kcal),logDate:dayKey(),timestamp:Date.now()
      });
      setShowWorkout(false);
      try{
        const response=await getDiaryLogs(user.id,dayKey());
        setLogs(Array.isArray(response.data)?response.data:[]);
        setMessage('Treino salvo no seu diário.');
      }catch{
        setMessage('Treino salvo no servidor. Atualize a página para ver os totais.');
      }
    }catch{setMessage('Não conseguimos registrar este treino. Confira a conexão.');}
    finally{setBusy(false);}
  };
  return (
    <main className="gg-movement">
      <div className="gg-movement-inner">
        <header className="gg-movement-hero">
          <span className="gg-movement-kicker"><FiActivity aria-hidden="true"/> MOVIMENTO / TODOS OS DIAS</span>
          <h1>TREINO <em>+</em> CARDIO<span>.</span></h1>
          <p>Escolha sua atividade. Faça o seu melhor hoje.</p>
        </header>
        <section className="gg-movement-day" aria-labelledby="gg-movement-today">
          <div className="gg-movement-day-title">
            <div><span>SEU PROGRESSO</span><h2 id="gg-movement-today">HOJE.</h2></div>
            <Link to="/registros">VER REGISTROS <FiArrowRight aria-hidden="true"/></Link>
          </div>
          {loading?<p className="gg-movement-message" role="status">Carregando atividades…</p>:error?
            <p className="gg-movement-message gg-movement-error" role="alert">{error}</p>:
            <>
              <div className="gg-movement-stats">
                <div><FiZap aria-hidden="true"/><span>GASTO ESTIMADO</span><strong>{format(today.calories)} <small>kcal</small></strong></div>
                <div><FiClock aria-hidden="true"/><span>TREINOS REGISTRADOS</span><strong>{workoutsDone} <small>treino(s)</small></strong></div>
                <div><FiMapPin aria-hidden="true"/><span>DISTÂNCIA</span><strong>{today.distanceKm?format(today.distanceKm):"—"} <small>km</small></strong></div>
              </div>
              {today.entries.length ?
                <div className="gg-movement-last">
                  <FiTrendingUp aria-hidden="true"/>
                  <span>{today.entries.length} atividade{today.entries.length!==1?'s':''} registrada{today.entries.length!==1?'s':''} hoje.</span>
                </div>:
                <p className="gg-movement-empty">Nenhuma atividade registrada hoje. Comece no seu ritmo.</p>}
            </>
          }
          <div className="gg-movement-meters">
            <div><div className="gg-movement-meter-head"><strong>TREINO DO DIA</strong><span>{workoutsDone?'FEITO · '+workoutsDone:'AINDA NÃO'}</span></div>
              <div className="gg-movement-meter" role="progressbar" aria-label="Treino realizado hoje" aria-valuenow={workoutsDone?1:0} aria-valuemin="0" aria-valuemax="1">
                <span style={{width:workoutsDone?'100%':'0%'}} /></div></div>
            <div><div className="gg-movement-meter-head"><strong>GASTO ESTIMADO</strong><span>{validBurnGoal?format(today.calories)+' / '+format(validBurnGoal)+' kcal':'SEM REFERÊNCIA'}</span></div>
              {burnProgress&&<div className="gg-movement-meter" role="progressbar" aria-label="Gasto calórico em relação à referência" aria-valuenow={Math.min(today.calories,validBurnGoal)} aria-valuemin="0" aria-valuemax={validBurnGoal}>
                <span style={{width:burnProgress.percent+'%'}}/></div>}
              <label className="gg-movement-goal-label">REFERÊNCIA PESSOAL (KCAL, OPCIONAL)
                <input type="number" min="30" max="3000" placeholder="Defina sua referência"
                  value={burnGoal} onChange={e=>saveGoal(e.target.value)} inputMode="numeric"/>
              </label></div>
          </div>
          <p className="gg-movement-note">Estimativas não são subtraídas da alimentação. Duração e distância do GPS ainda não sincronizam com o servidor.</p>
        </section>
        <section className="gg-movement-actions" aria-labelledby="gg-movement-start">
          <div className="gg-movement-section-heading"><span>01 / AÇÃO</span><h2 id="gg-movement-start">O QUE VAMOS FAZER?</h2></div>
          <button type="button" className="gg-movement-primary gg-movement-workout-toggle" aria-expanded={showWorkout}
            onClick={()=>setShowWorkout(!showWorkout)} aria-label="Registrar treino feito">
            <span className="gg-movement-action-icon"><FiActivity aria-hidden="true"/></span>
            <span><strong>REGISTRAR TREINO FEITO</strong><small>Musculação, séries e gasto estimado</small></span>
            <FiArrowRight aria-hidden="true"/>
          </button>
          {showWorkout&&<form className="gg-movement-workout-form" onSubmit={saveWorkout}>
            <label>Tipo de treino
              <select value={workout.name} onChange={e=>setWorkout({...workout,name:e.target.value})}>
                {['Costas e bíceps','Peito e tríceps','Pernas','Ombros','Superior','Inferior','Corpo inteiro'].map(name=><option key={name}>{name}</option>)}
              </select>
            </label>
            <label>Minutos de treino
              <input type="number" min="1" max="600" value={workout.minutes} onChange={e=>setWorkout({...workout,minutes:e.target.value})} inputMode="numeric"/>
            </label>
            <label>Gasto estimado em kcal (opcional)
              <input type="number" min="0" max="3000" value={workout.calories} onChange={e=>setWorkout({...workout,calories:e.target.value})} placeholder="Se souber; não calculamos automaticamente" inputMode="numeric"/>
            </label>
            <p>Treino e duração ficam registrados no nome. As calorias só entram no total se você informar sua própria estimativa.</p>
            <button type="submit" disabled={busy} className="gg-movement-save-workout">{busy?'SALVANDO…':'SALVAR TREINO'}</button>
          </form>}
          {message&&<p className="gg-movement-message" role="status">{message}</p>}
          <Link className="gg-movement-primary" to="/cardio/select" aria-label="Começar cardio">
            <span className="gg-movement-action-icon"><FiActivity aria-hidden="true"/></span>
            <span><strong>COMEÇAR CARDIO</strong><small>Corrida, caminhada ou cronômetro</small></span>
            <FiArrowRight aria-hidden="true"/>
          </Link>
          <Link className="gg-movement-secondary" to="/routine-generator" aria-label="Montar rotina">
            <FiTarget aria-hidden="true"/><span><strong>MONTAR ROTINA</strong><small>Seu plano semanal de treinos</small></span><FiArrowRight aria-hidden="true"/>
          </Link>
          <Link className="gg-movement-secondary" to="/exercise-library" aria-label="Abrir biblioteca de exercícios">
            <FiBookOpen aria-hidden="true"/><span><strong>BIBLIOTECA DE EXERCÍCIOS</strong><small>Encontre movimentos e execução</small></span><FiArrowRight aria-hidden="true"/>
          </Link>
        </section>
        <div className="gg-movement-bottom"><FiCompass aria-hidden="true"/> CONSTÂNCIA ACIMA DE PERFEIÇÃO.</div>
      </div>
    </main>
  );
}
