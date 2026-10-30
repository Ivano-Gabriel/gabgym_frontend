import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowRight, FiCoffee, FiDroplet, FiActivity, FiTarget, FiEdit3, FiPlus, FiCalendar } from 'react-icons/fi';
import { getCurrentUser, getDiaryLogs, getMetas } from '../services/apiService';
import { dayKey, summarizeDay, calorieProgress } from '../utils/nutrition';
import {activeDay,computeStreak} from '../utils/streak';
import {FaFire} from 'react-icons/fa';
import './TodayDashboard.css';

const n = value => Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 1 });

export default function TodayDashboard() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [streak,setStreak] = useState(null);
  const { pathname } = useLocation();
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const response = await getCurrentUser();
        const person = response.data;
        if (!person?.id) throw new Error('Perfil indisponível');
        const [foods, targets] = await Promise.allSettled([
          getDiaryLogs(person.id, dayKey()),
          getMetas(person.id),
        ]);
        if (!alive) return;
        setUser(person);
        if (foods.status === 'fulfilled') setLogs(Array.isArray(foods.value.data) ? foods.value.data : []);
        else setError('Não conseguimos carregar seu diário de hoje.');
        if (targets.status === 'fulfilled') setGoals(Array.isArray(targets.value.data) ? targets.value.data : []);
      } catch {
        if (alive) setError('Não conseguimos carregar seu dia. Confira sua conexão.');
      } finally { if (alive) setLoading(false); }
    };
    load();
    return () => { alive = false; };
  }, [pathname]);

  useEffect(()=>{
    if(!user?.id || error)return undefined;
    let alive=true;
    // O endpoint atual retorna um dia por vez. Limite honesto aos últimos 7 dias.
    const now=new Date();
    const dates=Array.from({length:7},(_,i)=>dayKey(new Date(now.getFullYear(),now.getMonth(),now.getDate()-i,12)));
    Promise.allSettled(dates.map((date,i)=>i===0?Promise.resolve({data:logs}):getDiaryLogs(user.id,date)))
      .then(results=>{
        if(!alive)return;
        if(results.some(x=>x.status!=='fulfilled')){setStreak(null);return;}
        setStreak(computeStreak(results.map(x=>activeDay(x.value.data))));
      });
    return()=>{alive=false;};
  },[user?.id,logs,error]);
  const totals = useMemo(() => summarizeDay(logs), [logs]);
  const waterGoalRaw = user ? Number(localStorage.getItem('gabgym:water-goal:' + user.id)) : 0;
  const waterGoal = waterGoalRaw >= 250 && waterGoalRaw <= 10000 ? waterGoalRaw : null;
  const foodGoalRaw = user ? Number(localStorage.getItem('gabgym:daily-goal:' + user.id)) : 0;
  const foodGoal = foodGoalRaw >= 1200 && foodGoalRaw <= 7000 ? foodGoalRaw : null;
  const waterProgress = waterGoal ? calorieProgress(totals.water, waterGoal) : null;
  const kcalProgress = foodGoal ? calorieProgress(totals.calories, foodGoal) : null;
  const extras = user ? (() => {
    try {
      const obj = JSON.parse(localStorage.getItem('gabgym:body-measures:' + user.id) || '{}');
      return obj && typeof obj === 'object' ? obj : {};
    } catch { return {}; }
  })() : {};
  const dateLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const activeGoals = goals.filter(g => g.status === 'ATIVA').slice(0,3);

  return (
    <div className="gg-today">
      <div className="gg-today-inner">
        <header className="gg-today-heading">
          <span className="gg-today-eyebrow"><FiCalendar aria-hidden="true"/> {dateLabel}</span>
          <h1>SEU DIA<span>.</span></h1>
          <p>{user?.name ? 'Continue, ' + user.name.split(' ')[0] + '.' : 'O importante é continuar.'}</p>
        </header>
        {loading && <div className="gg-today-state" role="status">Sincronizando seus registros…</div>}
        {error && <div className="gg-today-error" role="alert">{error}</div>}
        {!loading && user && <>
          <section className="gg-today-fire" aria-label="Foguinho de constância">
            <FaFire aria-hidden="true"/>
            <div><strong>{streak===null?'SEQUÊNCIA INDISPONÍVEL':streak.days+(streak.capped?'+':'')+' DIA'+(streak.days!==1?'S':'')+' DE CONSTÂNCIA'}</strong>
              <small>{streak===null?'Verificando últimos sete dias…':
               streak.atRisk?'Registre algo hoje para manter seu foguinho.':
               streak.days?'Seu foguinho reflete ações reais registradas.':'Um dia sem registro encerra a sequência. Recomece hoje.'}</small>
            </div>
            <span>{streak?.days ? '🔥' : '○'}</span>
          </section>
          <section className="gg-today-measures" aria-label="Suas medidas">
            <div><span>PESO</span><strong>{user.weight ? n(user.weight) + ' kg' : '—'}</strong></div>
            <div><span>ALTURA</span><strong>{user.height ? n(user.height) + ' cm' : '—'}</strong></div>
            <div><span>CINTURA</span><strong>{extras.waist ? n(extras.waist) + ' cm' : '—'}</strong></div>
            <Link to="/profile-form" className="gg-today-measures-edit" aria-label="Editar medidas"><FiEdit3 aria-hidden="true"/></Link>
          </section>

          <div className="gg-today-section-heading"><div><span>01 / HOJE</span><h2>SUA CONSTÂNCIA.</h2></div></div>
          <div className="gg-today-progress-grid">
            <Link to="/alimentacao" className="gg-today-progress-card">
              <div className="gg-today-card-top"><FiCoffee aria-hidden="true"/><span>ALIMENTAÇÃO</span><FiArrowRight aria-hidden="true"/></div>
              <strong>{n(totals.calories)} <small>kcal</small></strong>
              {kcalProgress ? <>
                <div role="progressbar" aria-label="Calorias diárias" aria-valuenow={Math.min(totals.calories, foodGoal)} aria-valuemin="0" aria-valuemax={foodGoal} className="gg-today-track"><span style={{width:kcalProgress.percent+'%'}}/></div>
                <small>{n(totals.calories)} / {n(foodGoal)} kcal</small>
              </> : <small>Sem meta definida · Definir na Alimentação</small>}
            </Link>
            <Link to="/alimentacao" className="gg-today-progress-card">
              <div className="gg-today-card-top"><FiDroplet aria-hidden="true"/><span>ÁGUA</span><FiArrowRight aria-hidden="true"/></div>
              <strong>{n(totals.water)} <small>ml</small></strong>
              {waterProgress ? <>
                <div role="progressbar" aria-label="Água diária" aria-valuenow={Math.min(totals.water, waterGoal)} aria-valuemin="0" aria-valuemax={waterGoal} className="gg-today-track"><span style={{width:waterProgress.percent+'%'}}/></div>
                <small>{n(totals.water)} / {n(waterGoal)} ml</small>
              </> : <small>Sem meta definida · Ajustar hidratação</small>}
            </Link>
          </div>
          <div className="gg-today-section-heading">
            <div><span>02 / SEUS OBJETIVOS</span><h2>UM DIA DE CADA VEZ.</h2></div>
            <Link to="/minhas-metas" aria-label="Definir ou ver metas"><FiPlus aria-hidden="true"/> METAS</Link>
          </div>
          {activeGoals.length ? <div className="gg-today-goals">
            {activeGoals.map(goal => <Link className="gg-today-goal" to="/minhas-metas" key={goal.id}>
              <FiTarget aria-hidden="true"/><span>{goal.titulo}</span><FiArrowRight aria-hidden="true"/>
            </Link>)}
            <p>Metas pendentes. O progresso automático de corrida e sono entra quando esses registros estiverem integrados.</p>
          </div> :
            <Link className="gg-today-no-goal" to="/minhas-metas"><FiTarget aria-hidden="true"/><span><strong>SEM METAS? DEFINA A PRIMEIRA.</strong><small>Corrida, hidratação ou hábitos. Escolha algo possível para hoje.</small></span><FiArrowRight aria-hidden="true"/></Link>}
          <div className="gg-today-shortcuts">
            <Link to="/treino"><FiActivity aria-hidden="true"/> INICIAR TREINO <FiArrowRight aria-hidden="true"/></Link>
            <Link to="/alimentacao"><FiCoffee aria-hidden="true"/> REGISTRAR REFEIÇÃO <FiArrowRight aria-hidden="true"/></Link>
          </div>
        </>}
      </div>
    </div>
  );
}
