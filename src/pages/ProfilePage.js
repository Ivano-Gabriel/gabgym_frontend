import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiEdit3, FiTarget, FiClock, FiLogOut, FiArrowRight, FiShield, FiCamera } from 'react-icons/fi';
import { getCurrentUser, logoutUser } from '../services/apiService';
import { isSuperAdmin } from '../utils/auth';
import './ProfilePage.css';
import {loadWeightHistory,weightTrend,safeWeightProjection,weightGoalProgress} from '../utils/weightProgress';
import {readProfileAvatar,saveProfileAvatar,isSupportedProfileImage} from '../utils/profileAvatar';
import StreakCalendar from '../components/StreakCalendar';

export default function ProfilePage() {
  const navigate = useNavigate();
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
    }).catch(()=>{if(alive)setError('Não conseguimos carregar seu perfil.');});
    return()=>{alive=false};
  },[]);
  const logout=async()=>{
    if(busy)return;setBusy(true);
    try{ await logoutUser(); }catch{ /* Serviço pode estar dormindo. */ }
    navigate('/login',{replace:true});
  };
  const imagePicked=event=>{
    const file=event.target.files?.[0];
    if(!file)return;
    if(!user?.id)return;
    if(!isSupportedProfileImage(file)){
      setError('Use PNG, JPG ou WebP com até 1,5 MB.');return;
    }
    const reader=new FileReader();
    reader.onload=()=>{
      if(typeof reader.result!=='string')return;
      if(saveProfileAvatar(user.id,reader.result)){
        setAvatar(reader.result);
        setError('');
      }else setError('O navegador não conseguiu salvar a foto. Libere espaço ou tente outra imagem.');
    };
    reader.onerror=()=>setError('Não foi possível ler a foto escolhida.');
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
    ['PESO',user?.weight,'kg'],['ALTURA',user?.height,'cm'],
    ['CINTURA',extras.waist,'cm'],['PEITORAL',extras.chest,'cm'],
    ['COXA',extras.thigh,'cm'],['BÍCEPS',extras.biceps,'cm']
  ];
  const links=[
    {to:'/profile-form',label:'EDITAR MEDIDAS',Icon:FiEdit3,description:'Peso, altura e acompanhamento'},
    {to:'/minhas-metas',label:'MINHAS METAS',Icon:FiTarget,description:'Pequenas escolhas, todos os dias'},
    {to:'/historico',label:'HISTÓRICO',Icon:FiClock,description:'Seus registros e sua evolução'},
  ];
  return (
    <main className="gg-profile">
      <div className="gg-profile-wrap">
        <div className="gg-profile-eyebrow">GABGYM / SUA JORNADA</div>
        <section className="gg-profile-heading">
          <div className="gg-profile-avatar">
            {avatar?<img src={avatar} alt="Foto de perfil"/>:<FiUser aria-hidden="true"/>}
            <label title="Alterar foto de perfil" aria-label="Alterar foto de perfil"><FiCamera aria-hidden="true"/>
              <input type="file" accept="image/*" onChange={imagePicked} aria-label="Escolher foto de perfil"/>
            </label>
          </div>
          <div><span className="gg27-profile-kicker">SUA EVOLUÇÃO</span><h1>{user?.name || user?.username || 'MEU PERFIL'}<span>.</span></h1><p>Seu progresso, seu ritmo.</p></div>
        </section>
        {error&&<p className="gg-profile-error" role="alert">{error}</p>}
        {!user&&!error&&<p role="status">Carregando perfil…</p>}
        {user&&<>
          <StreakCalendar compact userId={user.id}/>
          <p className="gg27-profile-timing">Medidas: acompanhe semanal, quinzenal ou mensalmente.</p>
          <div className="gg-profile-section-name"><span>01 / ACOMPANHAMENTO</span><h2>SUAS MEDIDAS.</h2></div>
          <div className="gg-profile-stat-grid">
            {stats.map(([name,value,unit])=><Link to="/profile-form" key={name} aria-label={'Atualizar '+name.toLowerCase()}><span>{name}</span><strong>{value!=null&&value!==''?Number(value).toLocaleString('pt-BR',{maximumFractionDigits:1})+' '+unit:'—'}</strong><FiEdit3 aria-hidden="true"/></Link>)}
          </div>
          <Link className="gg-profile-data-link" to="/profile-form">REGISTRAR NOVO PESO E MEDIDAS <FiArrowRight aria-hidden="true"/></Link>
          <section className="gg-profile-weight-progress" aria-label="Evolução do peso">
            <header><span>META DE PESO</span><Link to="/profile-form" className="gg27-weight-link"><strong>{weightGoal?weightGoal.toLocaleString('pt-BR')+' kg':'DEFINIR META'}</strong><FiEdit3 aria-hidden="true"/></Link></header>
            {weightGoal&&currentWeight ? <>
              {weightProgressPct!==null ? <>
                <div className="gg-profile-weight-track" role="progressbar" aria-label="Progresso real em direção à meta de peso" aria-valuenow={weightProgressPct} aria-valuemin="0" aria-valuemax="100">
                  <span style={{width:weightProgressPct+'%'}}/>
                </div>
                <p>{weightProgressPct}% do caminho até sua meta. {weightDelta!==null ? (weightDelta>0?'+':'')+weightDelta.toLocaleString('pt-BR')+' kg desde a primeira pesagem registrada.' : ''}</p>
              </> : <p>Registre seu peso para começar a acompanhar o progresso em direção à meta.</p>}
              {projection?<p className="gg-profile-projection">Se a tendência observada entre pesagens continuar: cerca de {projection.weeks} semanas. É apenas um cenário, não uma previsão garantida.</p>:
                <p>Registre novas pesagens ao longo das semanas para acompanhar a tendência, sem estimar prazos prematuramente.</p>}
            </> : <p>Sem meta definida. Você pode escolher uma meta opcional na edição do perfil.</p>}
            <small>Meta e histórico de peso ficam apenas neste navegador. Não são sincronizados entre dispositivos.</small>
          </section>
          <div className="gg-profile-section-name"><span>02 / CONTINUAR</span><h2>SEUS PRÓXIMOS PASSOS.</h2></div>
          <div className="gg-profile-links">
            {links.map(({to,label,Icon,description})=><Link to={to} key={to}><Icon aria-hidden="true"/><span><strong>{label}</strong><small>{description}</small></span><FiArrowRight aria-hidden="true"/></Link>)}
            {isSuperAdmin()&&<Link to="/admin"><FiShield aria-hidden="true"/><span><strong>ADMINISTRAÇÃO</strong><small>Gerenciar alunos</small></span><FiArrowRight aria-hidden="true"/></Link>}
          </div>
          <button className="gg-profile-logout" onClick={logout} disabled={busy}><FiLogOut aria-hidden="true"/> SAIR DA CONTA</button>
        </>}
      </div>
    </main>
  );
}
