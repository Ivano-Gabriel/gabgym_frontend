import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiEdit3, FiTarget, FiClock, FiLogOut, FiArrowRight, FiShield, FiCamera } from 'react-icons/fi';
import { getCurrentUser, logoutUser } from '../services/apiService';
import { isSuperAdmin } from '../utils/auth';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [avatar,setAvatar] = useState('');
  const [extras,setExtras] = useState({});
  const [busy,setBusy] = useState(false);
  useEffect(()=>{
    let alive=true;
    getCurrentUser().then(({data})=>{
      if(!alive)return;
      setUser(data);
      setAvatar(localStorage.getItem('gabgymAvatar') || '');
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
    if(!file.type.startsWith('image/') || file.size>1_500_000){
      setError('Selecione uma imagem de até 1,5 MB.');return;
    }
    const reader=new FileReader();
    reader.onload=()=>{if(typeof reader.result==='string'){setAvatar(reader.result);localStorage.setItem('gabgymAvatar',reader.result);}};
    reader.readAsDataURL(file);
  };
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
          <div><h1>MEU PERFIL<span>.</span></h1><p>{user?.name || user?.username || 'Sua evolução começa aqui.'}</p></div>
        </section>
        {error&&<p className="gg-profile-error" role="alert">{error}</p>}
        {!user&&!error&&<p role="status">Carregando perfil…</p>}
        {user&&<>
          <div className="gg-profile-section-name"><span>01 / ACOMPANHAMENTO</span><h2>SUAS MEDIDAS.</h2></div>
          <div className="gg-profile-stat-grid">
            {stats.map(([name,value,unit])=><div key={name}><span>{name}</span><strong>{value!=null&&value!==''?Number(value).toLocaleString('pt-BR',{maximumFractionDigits:1})+' '+unit:'—'}</strong></div>)}
          </div>
          <Link className="gg-profile-data-link" to="/profile-form">ATUALIZAR MEU PERFIL <FiArrowRight aria-hidden="true"/></Link>
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
