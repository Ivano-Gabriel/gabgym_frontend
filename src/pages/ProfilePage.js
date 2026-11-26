import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiEdit3, FiTarget, FiClock, FiLogOut, FiArrowRight, FiShield, FiCamera, FiSettings } from 'react-icons/fi';
import { getCurrentUser, logoutUser } from '../services/apiService';
import { isSuperAdmin } from '../utils/auth';
import PremiumPhoto from '../components/PremiumPhoto';
import './ProfilePage.css';
import {loadWeightHistory,weightTrend,safeWeightProjection,weightGoalProgress} from '../utils/weightProgress';
import {readProfileAvatar,saveProfileAvatar,isSupportedProfileImage} from '../utils/profileAvatar';
import StreakCalendar from '../components/StreakCalendar';
import {useTranslation} from 'react-i18next';

export default function ProfilePage() {
  const navigate = useNavigate();
  const {t,i18n}=useTranslation();
  const locale=i18n.resolvedLanguage==='pt'?'pt-BR':i18n.resolvedLanguage||'pt-BR';
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [avatar,setAvatar] = useState('');
  const [extras,setExtras] = useState({});
  const [busy,setBusy] = useState(false);
  const [weightGoal,setWeightGoal] = useState(null);
  const [weightHistory,setWeightHistory] = useState([]);
  useEffect(()=>{
    let alive=true;
    getCurrentUser().then(({data})=>{
      if(!alive)return;
      setUser(data);
      const w=Number(localStorage.getItem('gabgym:weight-goal:'+data.id));
      setWeightGoal(w>=20&&w<=600?w:null);
      setWeightHistory(loadWeightHistory(data.id));
      setAvatar(readProfileAvatar(data.id));
      try{
        const saved=JSON.parse(localStorage.getItem('gabgym:body-measures:'+data.id)||'{}');
        setExtras(saved && typeof saved==='object'?saved:{});
      }catch{setExtras({});}
    }).catch(()=>{if(alive)setError('profilePage.loadError');});
    return()=>{alive=false};
  },[]);
  const logout=async()=>{
    if(busy)return;setBusy(true);
    try{ await logoutUser(); }catch{}
    navigate('/login',{replace:true});
  };
  const imagePicked=event=>{
    const file=event.target.files?.[0];
    if(!file)return;
    if(!user?.id)return;
    if(!isSupportedProfileImage(file)){
      setError('profilePage.imageType');return;
    }
    const reader=new FileReader();
    reader.onload=()=>{
      if(typeof reader.result!=='string')return;
      if(saveProfileAvatar(user.id,reader.result)){
        setAvatar(reader.result);
        setError('');
      }else setError('profilePage.imageSaveError');
    };
    reader.onerror=()=>setError('profilePage.imageReadError');
    reader.readAsDataURL(file);
  };
  const trend=weightTrend(weightHistory);
  const currentWeight=Number(user?.weight)||trend?.latest||null;
  const baseline=trend?.starting;
  const weightProgressPct=weightGoalProgress(baseline,currentWeight,weightGoal);
  const weightDelta=baseline && currentWeight ? Math.round((currentWeight-baseline)*10)/10 : null;
  const first=weightHistory[0],last=weightHistory[weightHistory.length-1];
  const daySpan=first&&last?(new Date(last.date+'T12:00:00')-new Date(first.date+'T12:00:00'))/86400000:0;
  const observedWeeklyRate=daySpan>=14 ? (last.weight-first.weight)/(daySpan/7) : 0;
  const projection=weightGoal&&currentWeight ? safeWeightProjection(currentWeight,weightGoal,observedWeeklyRate):null;
  const stats=[
    [t('profilePage.weight'),user?.weight,'kg'],[t('profilePage.height'),user?.height,'cm'],
    [t('profilePage.waist'),extras.waist,'cm'],[t('profilePage.chest'),extras.chest,'cm'],
    [t('profilePage.thigh'),extras.thigh,'cm'],[t('profilePage.biceps'),extras.biceps,'cm']
  ];
  const links=[
    {to:'/profile-form',label:t('profilePage.editMeasures'),Icon:FiEdit3,description:t('profilePage.editDetail')},
    {to:'/minhas-metas',label:t('profilePage.myGoals'),Icon:FiTarget,description:t('profilePage.goalsDetail')},
    {to:'/historico',label:t('journal.historyTitle'),Icon:FiClock,description:t('profilePage.historyDetail')},
  ];
  return (
    <main className="gg-profile">
      <div className="gg-profile-wrap">
        <div className="gg-profile-eyebrow">{t('profilePage.journey')}</div>
        <section className="gg-profile-heading gg-photo-hero">
          <PremiumPhoto scene="gym" decorative priority />
          <div className="gg-profile-avatar">
            {avatar?<img src={avatar} alt={t('profilePage.photo')}/>:<FiUser aria-hidden="true"/>}
            <label title={t('profilePage.changePhoto')} aria-label={t('profilePage.changePhoto')}><FiCamera aria-hidden="true"/>
              <input type="file" accept="image/*" onChange={imagePicked} aria-label={t('profilePage.choosePhoto')}/>
            </label>
          </div>
          <div><span className="gg27-profile-kicker">{t('profilePage.progress')}</span><h1>{user?.name || user?.username || t('profilePage.myProfile')}<span>.</span></h1><p>{t('profilePage.subtitle')}</p></div>
        </section>
        {error&&<p className="gg-profile-error" role="alert">{t(error)}</p>}
        {!user&&!error&&<p role="status">{t('profilePage.loading')}</p>}
        {user&&<>
          <StreakCalendar compact userId={user.id}/>
          <p className="gg27-profile-timing">{t('profilePage.timing')}</p>
          <div className="gg-profile-section-name"><span>{t('profilePage.tracking')}</span><h2>{t('profilePage.measures')}</h2></div>
          <div className="gg-profile-stat-grid">
            {stats.map(([name,value,unit])=><Link to="/profile-form" key={name} aria-label={t('profilePage.update',{name:name.toLocaleLowerCase(locale)})}><span>{name}</span><strong>{value!=null&&value!==''?Number(value).toLocaleString(locale,{maximumFractionDigits:1})+' '+unit:'—'}</strong><FiEdit3 aria-hidden="true"/></Link>)}
          </div>
          <Link className="gg-profile-data-link" to="/profile-form">{t('profilePage.recordMeasures')} <FiArrowRight aria-hidden="true"/></Link>
          <section className="gg-profile-weight-progress gg-photo-surface" aria-label={t('profilePage.weightProgress')}>
            <PremiumPhoto scene="goals" decorative />
            <header><span>{t('profilePage.weightGoal')}</span><Link to="/profile-form" className="gg27-weight-link"><strong>{weightGoal?weightGoal.toLocaleString(locale)+' kg':t('profilePage.setGoal')}</strong><FiEdit3 aria-hidden="true"/></Link></header>
            {weightGoal&&currentWeight ? <>
              {weightProgressPct!==null ? <>
                <div className="gg-profile-weight-track" role="progressbar" aria-label={t('profilePage.realProgress')} aria-valuenow={weightProgressPct} aria-valuemin="0" aria-valuemax="100">
                  <span style={{width:weightProgressPct+'%'}}/>
                </div>
                <p>{t('profilePage.goalPct',{pct:weightProgressPct})} {weightDelta!==null?t('profilePage.weightDelta',{delta:(weightDelta>0?'+':'')+weightDelta.toLocaleString(locale)}):''}</p>
              </> : <p>{t('profilePage.startTrack')}</p>}
              {projection?<p className="gg-profile-projection">{t('profilePage.projection',{weeks:projection.weeks})}</p>:
                <p>{t('profilePage.moreWeights')}</p>}
            </> : <p>{t('profilePage.noGoal')}</p>}
            <small>{t('profilePage.localOnly')}</small>
          </section>
          <div className="gg-profile-section-name"><span>{t('profilePage.next')}</span><h2>{t('profilePage.nextSteps')}</h2></div>
          <div className="gg-profile-links">
            {links.map(({to,label,Icon,description})=><Link to={to} key={to}><Icon aria-hidden="true"/><span><strong>{label}</strong><small>{description}</small></span><FiArrowRight aria-hidden="true"/></Link>)}
            <Link to="/configuracoes"><FiSettings aria-hidden="true"/><span><strong>{t("nav.experience")}</strong><small>{t("settings.description")}</small></span><FiArrowRight aria-hidden="true"/></Link>
            {isSuperAdmin()&&<Link to="/admin"><FiShield aria-hidden="true"/><span><strong>{t('profilePage.admin')}</strong><small>{t('profilePage.adminDetail')}</small></span><FiArrowRight aria-hidden="true"/></Link>}
          </div>
          <button className="gg-profile-logout" onClick={logout} disabled={busy}><FiLogOut aria-hidden="true"/> {t('profilePage.logout')}</button>
        </>}
      </div>
    </main>
  );
}
