import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import { FiArrowRight, FiCoffee, FiDroplet, FiActivity, FiTarget, FiPlus, FiCalendar, FiBookOpen, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';
import { getCurrentUser, getDiaryLogs, getMetas, addDiaryLog } from '../services/apiService';
import { dayKey, summarizeDay, calorieProgress } from '../utils/nutrition';
import StreakCalendar from '../components/StreakCalendar';
import {suggestDailyGoals,goalOrEstimate} from '../utils/nutritionGoals';
import './TodayDashboard.css';
import '../styles/premiumExperience.css';
import './TodayPremium.css';
import PremiumPhoto from '../components/PremiumPhoto';
import {greetingFor,makeWaterEntry,recentFoodsToday} from '../utils/todayActions';
import './TodayActions.css';


export default function TodayDashboard({settings={food:true,workout:true,weight:true,coach:true}}) {
  const {t,i18n}=useTranslation();
  const locale=i18n.resolvedLanguage==='pt'?'pt-BR':i18n.resolvedLanguage||'pt-BR';
  const n=value=>Number(value).toLocaleString(locale,{maximumFractionDigits:1});
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshVersion,setRefreshVersion] = useState(0);
  const [quickBusy,setQuickBusy] = useState(false);
  const [quickMessage,setQuickMessage] = useState('');
  const quickLock=useRef(false);
  const { pathname } = useLocation();
  useEffect(() => {
    let alive = true;
    setLoading(true);setError('');
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
        else setError('today.diaryError');
        if (targets.status === 'fulfilled') setGoals(Array.isArray(targets.value.data) ? targets.value.data : []);
      } catch {
        if (alive) setError('today.dayError');
      } finally { if (alive) setLoading(false); }
    };
    load();
    return () => { alive = false; };
  }, [pathname,refreshVersion]);

  const totals = useMemo(() => summarizeDay(logs), [logs]);
  const estimates=suggestDailyGoals(user);
  const waterGoal=user?goalOrEstimate(localStorage.getItem('gabgym:water-goal:'+user.id),estimates?.water,250,10000):null;
  const foodGoal=user?goalOrEstimate(localStorage.getItem('gabgym:daily-goal:'+user.id),estimates?.calories,1200,7000):null;
  const waterProgress = waterGoal ? calorieProgress(totals.water, waterGoal) : null;
  const kcalProgress = foodGoal ? calorieProgress(totals.calories, foodGoal) : null;
  const dateLabel = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const activeGoals = goals.filter(g => g.status === 'ATIVA').slice(0,3);
  const recentFoods = recentFoodsToday(logs,2);
  const reload = () => {
    setQuickMessage('');
    setRefreshVersion(value=>value+1);
  };
  const registerWater = async volume => {
    if (!user?.id || quickLock.current || loading) return;
    quickLock.current=true;setQuickBusy(true);setQuickMessage('');
    try {
      const entry=makeWaterEntry(user.id,volume);
      await addDiaryLog(entry);
      try {
        const fresh=await getDiaryLogs(user.id,dayKey());
        if (Array.isArray(fresh.data)) setLogs(fresh.data);
        else setLogs(current=>[...current,{...entry,id:'local-'+entry.timestamp}]);
      } catch {
        setLogs(current=>[...current,{...entry,id:'local-'+entry.timestamp}]);
      }
      setQuickMessage({key:'today.savedWater',volume});
    } catch {
      setQuickMessage({key:'today.waterError'});
    } finally { quickLock.current=false;setQuickBusy(false); }
  };

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
            alt={t('today.heroAlt')} />
          <div className="gg-today-hero-overlay" aria-hidden="true" />
          <div className="gg-today-hero-body">
            <span className="gg-today-eyebrow"><FiCalendar aria-hidden="true" /> {dateLabel}</span>
            <h1>{t('today.title')}<span>.</span></h1>
            <p>{greetingFor(user,t)}</p>
            {settings.workout&&<Link to="/treino" className="gg-today-hero-action">
              {t('today.openWorkout')} <FiArrowRight aria-hidden="true" />
            </Link>}
          </div>
          <span className="gg-today-hero-watermark" aria-hidden="true">GABGYM / 01</span>
        </header>
        {loading && <div className="gg-today-state" role="status">{t('today.sync')}</div>}
        {error && <div className="gg-today-error" role="alert">
          <p>{t(error)} {t('today.serverStarting')}</p>
          <button type="button" disabled={loading} onClick={reload} className="gg-today-retry">
            <FiRefreshCw aria-hidden="true"/> {t('journal.retry')}
          </button>
        </div>}
        {!loading && user && <>
          <div className="gg-today-dashboard-grid">
            <section className="gg-today-dashboard-main" aria-label={t('today.dailyRecords')}>
          <StreakCalendar userId={user.id} todayLogs={logs}/>
          <div className="gg-today-section-heading"><div><span>{t('today.todaySection')}</span><h2>{t('today.consistency')}</h2></div></div>
          {settings.food&&<><div className="gg-today-progress-grid">
            <Link to="/alimentacao" className="gg-today-progress-card gg-today-progress-card--food">
              <PremiumPhoto scene="food" decorative />
              <div className="gg-today-card-top"><FiCoffee aria-hidden="true"/><span>{t('journal.food')}</span><FiArrowRight aria-hidden="true"/></div>
              <strong>{n(totals.calories)} <small>kcal</small></strong>
              {kcalProgress ? <>
                <div role="progressbar" aria-label={t('today.dailyCalories')} aria-valuenow={Math.min(totals.calories, foodGoal)} aria-valuemin="0" aria-valuemax={foodGoal} className="gg-today-track"><span style={{width:kcalProgress.percent+'%'}}/></div>
                <small>{n(totals.calories)} / {n(foodGoal)} kcal</small>
              </> : <small>{t('today.noFoodGoal')}</small>}
            </Link>
            <Link to="/alimentacao" className="gg-today-progress-card gg-today-progress-card--water">
              <PremiumPhoto scene="water" decorative />
              <div className="gg-today-card-top"><FiDroplet aria-hidden="true"/><span>{t('journal.water')}</span><FiArrowRight aria-hidden="true"/></div>
              <strong>{n(totals.water)} <small>ml</small></strong>
              {waterProgress ? <>
                <div role="progressbar" aria-label={t('today.dailyWater')} aria-valuenow={Math.min(totals.water, waterGoal)} aria-valuemin="0" aria-valuemax={waterGoal} className="gg-today-track"><span style={{width:waterProgress.percent+'%'}}/></div>
                <small>{n(totals.water)} / {n(waterGoal)} ml</small>
              </> : <small>{t('today.noWaterGoal')}</small>}
            </Link>
          </div>
          <section className="gg-today-quick-actions" aria-label={t('today.quickActions')}>
            <div className="gg-today-quick-head"><span>{t('today.stayToday')}</span><h3>{t('today.oneTap')}</h3></div>
            <div className="gg-today-quick-buttons">
              <button type="button" disabled={quickBusy || loading || Boolean(error)}
                onClick={()=>registerWater(250)} aria-label={t('today.addWater',{volume:250})}>
                <FiDroplet aria-hidden="true"/> +250 ML
              </button>
              <button type="button" disabled={quickBusy || loading || Boolean(error)}
                onClick={()=>registerWater(500)} aria-label={t('today.addWater',{volume:500})}>
                <FiDroplet aria-hidden="true"/> +500 ML
              </button>
              <Link to="/alimentacao" className="gg-today-quick-food"><FiCoffee aria-hidden="true"/> {t('today.addMeal')} <FiArrowRight aria-hidden="true"/></Link>
            </div>
            {quickBusy && <p className="gg-today-quick-status" role="status">{t('today.saving')}</p>}
            {quickMessage && <p className="gg-today-quick-status" role="status">{quickMessage.key==='today.savedWater' && <FiCheckCircle aria-hidden="true"/>}{t(quickMessage.key,{volume:quickMessage.volume})}</p>}
            {recentFoods.length>0 && <div className="gg-today-quick-recent">
              <strong>{t('today.recentMeals')}</strong>
              <ul>{recentFoods.map((food,index)=><li key={food.id||index}><span>{food.name}</span>
                {Number.isFinite(Number(food.calories))&&food.calories!==null&&food.calories!==undefined
                  ? <small>{n(food.calories)} kcal</small>:null}</li>)}</ul>
            </div>}
          </section></>}
          {settings.coach&&<Link className="gg-today-coach-entry" to="/meu-personal"><FiArrowRight aria-hidden="true"/>{t('nav.coach')}</Link>}
            </section>
            <section className="gg-today-dashboard-aside" aria-label={t('today.goalsActions')}>
              <PremiumPhoto scene="goals" decorative />
          <div className="gg-today-section-heading">
            <div><span>{t('today.goalsSection')}</span><h2>{t('today.oneDay')}</h2></div>
            <Link to="/minhas-metas" aria-label={t('today.viewGoals')}><FiPlus aria-hidden="true"/> {t('today.goals')}</Link>
          </div>
          {activeGoals.length ? <div className="gg-today-goals">
            {activeGoals.map(goal => <Link className="gg-today-goal" to="/minhas-metas" key={goal.id}>
              <FiTarget aria-hidden="true"/><span>{goal.titulo}</span><FiArrowRight aria-hidden="true"/>
            </Link>)}

          </div> :
            <Link className="gg-today-no-goal" to="/minhas-metas"><FiTarget aria-hidden="true"/><span><strong>{t('today.firstGoal')}</strong><small>{t('today.firstGoalDetail')}</small></span><FiArrowRight aria-hidden="true"/></Link>}
          <Link to="/biblioteca" className="gg27-biblioteca"><FiBookOpen aria-hidden="true"/> {t('today.library')} <FiArrowRight aria-hidden="true"/></Link>
          <div className="gg-today-shortcuts">
            {settings.workout&&<Link to="/treino"><FiActivity aria-hidden="true"/> {t('today.startWorkout')} <FiArrowRight aria-hidden="true"/></Link>}
            {settings.food&&<Link to="/alimentacao"><FiCoffee aria-hidden="true"/> {t('today.logMeal')} <FiArrowRight aria-hidden="true"/></Link>}
          </div>
            </section>
          </div>
        </>}
      </div>
    </div>
  );
}
