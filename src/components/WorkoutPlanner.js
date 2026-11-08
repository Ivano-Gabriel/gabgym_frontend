import React, {useEffect,useRef,useState} from 'react';
import {FiActivity,FiCheck,FiClock,FiPlus,FiSave,FiTrash2,FiTrendingUp,FiBookOpen} from 'react-icons/fi';
import {addDiaryLog} from '../services/apiService';
import {
  summarizeWorkout,buildWorkoutDiaryEntry,readWorkoutTemplates,saveWorkoutTemplate,
  deleteWorkoutTemplate,readWorkoutSessions,appendWorkoutSession
} from '../utils/workoutPlans';
import './WorkoutPlanner.css';
import {workoutSuggestions,workoutGroups,lastExerciseResult} from '../utils/workoutInsights';

const idGen = (()=>{let counter=0;return prefix=>prefix+'-'+Date.now()+'-'+(++counter);})();
const nOrZero = value => Number(value||0).toLocaleString('pt-BR',{maximumFractionDigits:1});
const newSet = (prev={})=>({id:idGen('set'),reps:prev.reps||'10',
  weightKg:prev.weightKg??'0',done:false});

export default function WorkoutPlanner({userId,onSaved}) {
  const [routineName,setRoutineName]=useState('Treino do dia');
  const [minutes,setMinutes]=useState('45');
  const [restSeconds,setRestSeconds]=useState('90');
  const [exerciseName,setExerciseName]=useState('');
  const [exerciseGroup,setExerciseGroup]=useState('');
  const [autoRest,setAutoRest]=useState(false);
  const [exercises,setExercises]=useState([]);
  const [plans,setPlans]=useState([]);
  const [history,setHistory]=useState([]);
  const [restRemaining,setRestRemaining]=useState(0);
  const [busy,setBusy]=useState(false);
  const [submitted,setSubmitted]=useState(false);
  const [feedback,setFeedback]=useState('');
  const submitLock=useRef(false);

  useEffect(()=>{
    setPlans(readWorkoutTemplates(userId));
    setHistory(readWorkoutSessions(userId));
  },[userId]);

  useEffect(()=>{
    if(restRemaining<=0)return undefined;
    const timer=setTimeout(()=>setRestRemaining(current=>Math.max(0,current-1)),1000);
    return()=>clearTimeout(timer);
  },[restRemaining]);

  const edit=fn=>{setExercises(fn);setSubmitted(false);setFeedback('');};
  const addNamedExercise=rawName=>{
    const name=String(rawName||'').trim();
    if(name.length<2||name.length>60){setFeedback('Informe um exercício com 2–60 caracteres.');return;}
    if(exercises.length>=20){setFeedback('Limite de 20 exercícios por ficha.');return;}
    edit(items=>[...items,{id:idGen('ex'),name,sets:[newSet()]}]);
    setExerciseName('');
  };
  const addExercise=event=>{event.preventDefault();addNamedExercise(exerciseName);};
  const suggestions=workoutSuggestions(exerciseName,exerciseGroup,5);
  const changeSet=(exerciseId,setId,patch)=>edit(items=>items.map(ex=>ex.id!==exerciseId?ex:{
    ...ex,sets:ex.sets.map(s=>s.id!==setId?s:{...s,...patch})
  }));
  const toggleDone=(exerciseId,set)=>{
    changeSet(exerciseId,set.id,{done:!set.done});
    if(!set.done && autoRest && Number(restSeconds)>0 && Number(restSeconds)<=600)
      setRestRemaining(Number(restSeconds));
  };
  const addSet=exerciseId=>edit(items=>items.map(ex=>{
    if(ex.id!==exerciseId||ex.sets.length>=15)return ex;
    return {...ex,sets:[...ex.sets,newSet(ex.sets[ex.sets.length-1])]};
  }));
  const removeSet=(exerciseId,setId)=>edit(items=>items.map(ex=>
    ex.id!==exerciseId?ex:{...ex,sets:ex.sets.length>1?ex.sets.filter(s=>s.id!==setId):ex.sets}
  ));
  const removeExercise=id=>edit(items=>items.filter(ex=>ex.id!==id));

  let stats;
  try {stats=summarizeWorkout(exercises);} catch {stats={exerciseCount:0,totalSets:0,completedSets:0,volumeKg:0};}
  const progress=stats.totalSets?Math.round(stats.completedSets/stats.totalSets*100):0;

  const savePlan=()=>{
    try {
      const stored=saveWorkoutTemplate(userId,{name:routineName,restSeconds:Number(restSeconds),exercises});
      setPlans(stored);
      setFeedback('Ficha salva neste navegador. Você pode reutilizá-la quando voltar.');
    }catch(error){setFeedback(error.message||'Não foi possível salvar a ficha.');}
  };
  const loadPlan=plan=>{
    setRoutineName(plan.name);
    setRestSeconds(String(plan.restSeconds));
    setExercises(plan.exercises.map(ex=>({...ex,id:idGen('ex'),sets:ex.sets.map(s=>({...s,id:idGen('set'),done:false}))})));
    setSubmitted(false);setFeedback('Ficha carregada. Marque as séries conforme treinar.');
  };
  const removePlan=plan=>{
    try {setPlans(deleteWorkoutTemplate(userId,plan.name));setFeedback('Ficha excluída deste navegador.');}
    catch {setFeedback('Não foi possível excluir a ficha.');}
  };
  const finish=async event=>{
    event.preventDefault();
    if(submitLock.current||submitted)return;
    let entry;
    try {entry=buildWorkoutDiaryEntry(userId,routineName,exercises,minutes);}
    catch(error){setFeedback(error.message);return;}
    submitLock.current=true;setBusy(true);setFeedback('');
    try {
      await addDiaryLog(entry);
      setSubmitted(true);
      let detailSaved=true;
      try {
        const sessions=appendWorkoutSession(userId,{
          name:routineName,minutes:Number(minutes),exercises,recordedAt:Date.now()
        });
        setHistory(sessions);
      } catch {detailSaved=false;}
      setFeedback(detailSaved
        ? 'Treino registrado no diário! Séries e cargas guardadas neste navegador.'
        : 'Resumo salvo no servidor, mas os detalhes não puderam ser guardados neste navegador.');
      if(typeof onSaved==='function') {
        try {await onSaved();} catch { /* O POST já foi confirmado; não induzir repetição. */ }
      }
    } catch {
      setFeedback('Não foi possível confirmar o registro. Confira o diário antes de reenviar.');
    } finally {submitLock.current=false;setBusy(false);}
  };

  return <section className="gg-plan" aria-label="Fichas de musculação">
    <div className="gg-plan-heading">
      <span>GABGYM / TREINO DE FORÇA</span>
      <h3>SÉRIES. CARGA. EVOLUÇÃO.</h3>
      <p>Monte uma ficha, marque cada série e acompanhe o volume real de treino. Calorias não são estimadas automaticamente.</p>
    </div>

    {plans.length>0&&<div className="gg-plan-templates" aria-label="Fichas salvas">
      <strong>MINHAS FICHAS NESTE NAVEGADOR</strong>
      <div>{plans.map(plan=><article key={plan.name} className="gg-plan-template">
        <span>{plan.name}</span>
        <button type="button" onClick={()=>loadPlan(plan)} disabled={busy} aria-label={'Carregar ficha '+plan.name}>USAR FICHA</button>
        <button type="button" onClick={()=>removePlan(plan)} disabled={busy} aria-label={'Excluir ficha '+plan.name}><FiTrash2 aria-hidden="true"/></button>
      </article>)}</div>
    </div>}

    <div className="gg-plan-metadata">
      <label>Nome da ficha<input value={routineName} maxLength="60" onChange={e=>{setRoutineName(e.target.value);setSubmitted(false);}} placeholder="Ex.: Peito e tríceps"/></label>
      <label>Minutos treinados<input type="number" min="1" max="600" inputMode="numeric" value={minutes} onChange={e=>{setMinutes(e.target.value);setSubmitted(false);}}/></label>
      <label>Descanso entre séries (s)<input type="number" min="0" max="600" inputMode="numeric" value={restSeconds} onChange={e=>setRestSeconds(e.target.value)}/></label>
    </div>
    <div className="gg-plan-rest">
      <div><FiClock aria-hidden="true"/><strong>{restRemaining>0?restRemaining+' s':'DESCANSO'}</strong><small>Temporizador local</small></div>
      <label className="gg-plan-auto-rest"><input type="checkbox" checked={autoRest}
        onChange={e=>setAutoRest(e.target.checked)}/> AUTO DESCANSO</label>
      <button type="button" onClick={()=>setRestRemaining(Number(restSeconds)||0)} disabled={Number(restSeconds)<1||Number(restSeconds)>600}>INICIAR DESCANSO</button>
      {restRemaining>0&&<button type="button" onClick={()=>setRestRemaining(0)}>PARAR</button>}
    </div>
    <div className="gg-plan-stats">
      <div><span>SÉRIES FEITAS</span><strong>{stats.completedSets} / {stats.totalSets}</strong></div>
      <div><span>VOLUME REAL</span><strong>{stats.volumeKg.toLocaleString('pt-BR')} kg</strong></div>
      <div><span>PROGRESSO</span><strong>{progress}%</strong></div>
    </div>
    <div className="gg-plan-track" role="progressbar" aria-label="Séries concluídas da ficha" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><span style={{width:progress+'%'}}/></div>


    <div className="gg-plan-library-header"><FiBookOpen aria-hidden="true"/><span>BIBLIOTECA DE EXERCÍCIOS DO GABGYM</span></div>
    <form className="gg-plan-add-exercise" onSubmit={addExercise}>
      <label>Adicionar exercício<input value={exerciseName} maxLength="60" onChange={e=>setExerciseName(e.target.value)} placeholder="Busque ou digite um exercício" /></label>
      <label className="gg-plan-group">Grupo muscular
        <select value={exerciseGroup} onChange={e=>setExerciseGroup(e.target.value)}>
          <option value="">TODOS</option>
          {workoutGroups.map(group=><option key={group} value={group}>{group.toUpperCase()}</option>)}
        </select>
      </label>
      <button type="submit" disabled={busy||exercises.length>=20}><FiPlus aria-hidden="true"/> ADICIONAR</button>
    </form>
    {suggestions.length>0&&<div className="gg-plan-exercise-quick" aria-label="Sugestões da biblioteca">
      {suggestions.map(suggestion=><button key={suggestion.id} type="button" disabled={busy||exercises.length>=20}
        onClick={()=>addNamedExercise(suggestion.name)} title={suggestion.group}>
        <FiPlus aria-hidden="true"/> {suggestion.name}
      </button>)}
    </div>}

    {exercises.length===0 && <p className="gg-plan-empty">Sua ficha começa aqui. Adicione um exercício e depois configure repetições e cargas.</p>}
    <div className="gg-plan-exercises">
      {exercises.map((ex,i)=><article className="gg-plan-exercise" key={ex.id}>
        <header><div><span>{String(i+1).padStart(2,'0')} / EXERCÍCIO</span><h4>{ex.name}</h4>
          {lastExerciseResult(history,ex.name)&&<small className="gg-plan-last-record">
            ÚLTIMA VEZ: {nOrZero(lastExerciseResult(history,ex.name).weightKg)} KG · {lastExerciseResult(history,ex.name).totalSets} SÉRIES
          </small>}</div>
          <button type="button" disabled={busy} onClick={()=>removeExercise(ex.id)} aria-label={'Remover exercício '+ex.name}><FiTrash2 aria-hidden="true"/></button>
        </header>
        <div className="gg-plan-sets">
          {ex.sets.map((set,j)=><div className={'gg-plan-set'+(set.done?' is-done':'')} key={set.id}>
            <span className="gg-plan-set-number">{j+1}</span>
            <label>REPETIÇÕES<input type="number" inputMode="numeric" min="1" max="100" value={set.reps} disabled={busy}
              aria-label={'Repetições série '+(j+1)+' de '+ex.name}
              onChange={e=>changeSet(ex.id,set.id,{reps:e.target.value})}/></label>
            <label>CARGA (KG)<input type="number" inputMode="decimal" step="0.5" min="0" max="500" value={set.weightKg} disabled={busy}
              aria-label={'Carga série '+(j+1)+' de '+ex.name}
              onChange={e=>changeSet(ex.id,set.id,{weightKg:e.target.value})}/></label>
            <button type="button" className="gg-plan-done" disabled={busy} aria-pressed={set.done}
              aria-label={(set.done?'Desmarcar':'Concluir')+' série '+(j+1)+' de '+ex.name}
              onClick={()=>toggleDone(ex.id,set)}><FiCheck aria-hidden="true"/></button>
            <button type="button" className="gg-plan-remove-set" disabled={busy||ex.sets.length===1}
              aria-label={'Excluir série '+(j+1)+' de '+ex.name}
              onClick={()=>removeSet(ex.id,set.id)}><FiTrash2 aria-hidden="true"/></button>
          </div>)}
        </div>
        <button type="button" className="gg-plan-add-set" disabled={busy||ex.sets.length>=15} onClick={()=>addSet(ex.id)}><FiPlus aria-hidden="true"/> NOVA SÉRIE</button>
      </article>)}
    </div>
    <div className="gg-plan-footer">
      <button type="button" className="gg-plan-save-template" disabled={busy||!exercises.length}
        onClick={savePlan}><FiSave aria-hidden="true"/> SALVAR FICHA</button>
      <form onSubmit={finish}>
        <button type="submit" className="gg-plan-save-session" disabled={busy||submitted||stats.completedSets===0}>
          <FiActivity aria-hidden="true"/> {busy?'SALVANDO…':submitted?'TREINO REGISTRADO':'FINALIZAR TREINO'}
        </button>
      </form>
    </div>
    {feedback&&<p className="gg-plan-feedback" role="status">{feedback}</p>}
    <p className="gg-plan-disclaimer">O servidor recebe apenas o resumo do treino (0 kcal estimadas). Fichas, séries e cargas ficam <strong>somente neste navegador</strong> e ainda não sincronizam entre dispositivos.</p>
    {history.length>0&&<div className="gg-plan-history"><strong><FiTrendingUp aria-hidden="true"/> HISTÓRICO LOCAL</strong>
      {history.slice(0,3).map((entry,index)=><details key={entry.recordedAt+'-'+index}>
        <summary>{entry.name} · {entry.minutes} min</summary>
        <ul>{entry.exercises.map((exercise,i)=><li key={i}>{exercise.name}: {exercise.sets.filter(s=>s.done).map(s=>s.reps+'x'+s.weightKg+'kg').join(', ')||'Sem séries feitas'}</li>)}</ul>
      </details>)}
    </div>}
  </section>;
}
