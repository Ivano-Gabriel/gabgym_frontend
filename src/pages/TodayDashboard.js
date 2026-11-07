import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowRight, FiCoffee, FiDroplet, FiActivity, FiTarget, FiPlus, FiCalendar, FiBookOpen } from 'react-icons/fi';
import { getCurrentUser, getDiaryLogs, getMetas } from '../services/apiService';
import { dayKey, summarizeDay, calorieProgress } from '../utils/nutrition';
import StreakCalendar from '../components/StreakCalendar';
import {suggestDailyGoals,goalOrEstimate} from '../utils/nutritionGoals';
import './TodayDashboard.css';
import '../styles/premiumExperience.css';
import './TodayPremium.css';
import PremiumPhoto from '../components/PremiumPhoto';

const n = value => Number(value).toLocaleString('pt-BR', { maximumFractionDigits: 1 });

export default function TodayDashboard() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const totals = useMemo(() => summarizeDay(logs), [logs]);
  const estimates=suggestDailyGoals(user);
  const waterGoal=user?goalOrEstimate(localStorage.getItem('gabgym:water-goal:'+user.id),estimates?.water,250,10000):null;
  const foodGoal=user?goalOrEstimate(localStorage.getItem('gabgym:daily-goal:'+user.id),estimates?.calories,1200,7000):null;
  const waterProgress = waterGoal ? calorieProgress(totals.water, waterGoal) : null;
  const kcalProgress = foodGoal ? calorieProgress(totals.calories, foodGoal) : null;
  const dateLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const activeGoals = goals.filter(g => g.status === 'ATIVA').slice(0,3);

  return (
    <div className="gg-today gg-today-premium">
      <div className="gg-today-inner">
        <header className="gg-today-heading gg-today-hero">
          <img className="gg-today-hero-photo"
            src="https://images.unsplash.com/photo-1689877020200-403d8542d95d?auto=format&fit=crop&q=80&w=1440"
            srcSet={[480,720,960,1440,1920,2560].map(w =>
              `https://images.unsplash.com/photo-1689877020200-403d8542d95d?auto=format&fit=crop&q=80&w=${w} ${w}w`).join(', ')}
            sizes="(max-width: 720px) 100vw, 1200px"
            loading="eager" decoding="async"
            alt="Equipamentos e pesos em uma academia real" />
          <div className="gg-today-hero-overlay" aria-hidden="true" />
          <div className="gg-today-hero-body">
            <span className="gg-today-eyebrow"><FiCalendar aria-hidden="true" /> {dateLabel}</span>
            <h1>SEU DIA<span>.</span></h1>
            <p>{user?.name ? 'Continue, ' + user.name.split(' ')[0] + '.' : 'O importante é continuar.'}</p>
            <Link to="/treino" className="gg-today-hero-action">
              ABRIR MEU TREINO <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
          <span className="gg-today-hero-watermark" aria-hidden="true">GABGYM / 01</span>
        </header>
        {loading && <div className="gg-today-state" role="status">Sincronizando seus registros…</div>}
        {error && <div className="gg-today-error" role="alert">{error}</div>}
        {!loading && user && <>
          <div className="gg-today-dashboard-grid">
            <section className="gg-today-dashboard-main" aria-label="Registros do dia">
          <StreakCalendar userId={user.id} todayLogs={logs}/>
          <div className="gg-today-section-heading"><div><span>01 / HOJE</span><h2>SUA CONSTÂNCIA.</h2></div></div>
          <div className="gg-today-progress-grid">
            <Link to="/alimentacao" className="gg-today-progress-card gg-today-progress-card--food">
              <PremiumPhoto scene="food" decorative />
              <div className="gg-today-card-top"><FiCoffee aria-hidden="true"/><span>ALIMENTAÇÃO</span><FiArrowRight aria-hidden="true"/></div>
              <strong>{n(totals.calories)} <small>kcal</small></strong>
              {kcalProgress ? <>
                <div role="progressbar" aria-label="Calorias diárias" aria-valuenow={Math.min(totals.calories, foodGoal)} aria-valuemin="0" aria-valuemax={foodGoal} className="gg-today-track"><span style={{width:kcalProgress.percent+'%'}}/></div>
                <small>{n(totals.calories)} / {n(foodGoal)} kcal</small>
              </> : <small>Sem meta definida · Definir na Alimentação</small>}
            </Link>
            <Link to="/alimentacao" className="gg-today-progress-card gg-today-progress-card--water">
              <PremiumPhoto scene="water" decorative />
              <div className="gg-today-card-top"><FiDroplet aria-hidden="true"/><span>ÁGUA</span><FiArrowRight aria-hidden="true"/></div>
              <strong>{n(totals.water)} <small>ml</small></strong>
              {waterProgress ? <>
                <div role="progressbar" aria-label="Água diária" aria-valuenow={Math.min(totals.water, waterGoal)} aria-valuemin="0" aria-valuemax={waterGoal} className="gg-today-track"><span style={{width:waterProgress.percent+'%'}}/></div>
                <small>{n(totals.water)} / {n(waterGoal)} ml</small>
              </> : <small>Sem meta definida · Ajustar hidratação</small>}
            </Link>
          </div>
            </section>
            <section className="gg-today-dashboard-aside" aria-label="Metas e ações">
              <PremiumPhoto scene="goals" decorative />
          <div className="gg-today-section-heading">
            <div><span>02 / SEUS OBJETIVOS</span><h2>UM DIA DE CADA VEZ.</h2></div>
            <Link to="/minhas-metas" aria-label="Definir ou ver metas"><FiPlus aria-hidden="true"/> METAS</Link>
          </div>
          {activeGoals.length ? <div className="gg-today-goals">
            {activeGoals.map(goal => <Link className="gg-today-goal" to="/minhas-metas" key={goal.id}>
              <FiTarget aria-hidden="true"/><span>{goal.titulo}</span><FiArrowRight aria-hidden="true"/>
            </Link>)}

          </div> :
            <Link className="gg-today-no-goal" to="/minhas-metas"><FiTarget aria-hidden="true"/><span><strong>SEM METAS? DEFINA A PRIMEIRA.</strong><small>Corrida, hidratação ou hábitos. Escolha algo possível para hoje.</small></span><FiArrowRight aria-hidden="true"/></Link>}
          <Link to="/biblioteca" className="gg27-biblioteca"><FiBookOpen aria-hidden="true"/> BIBLIOTECA <FiArrowRight aria-hidden="true"/></Link>
          <div className="gg-today-shortcuts">
            <Link to="/treino"><FiActivity aria-hidden="true"/> INICIAR TREINO <FiArrowRight aria-hidden="true"/></Link>
            <Link to="/alimentacao"><FiCoffee aria-hidden="true"/> REGISTRAR REFEIÇÃO <FiArrowRight aria-hidden="true"/></Link>
          </div>
            </section>
          </div>
        </>}
      </div>
    </div>
  );
}
