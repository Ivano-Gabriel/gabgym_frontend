import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {FiArrowLeft,FiCheckCircle,FiEdit3,FiLock,FiUsers} from 'react-icons/fi';
import {getCurrentUser} from '../services/apiService';
import {PERSONAL_GOALS,PERSONAL_FOCUS,personalBriefKey,sanitizePersonalBrief} from '../utils/personalBrief';
import './PersonalPage.css';
import StudentCoachPanel from '../components/StudentCoachPanel';
import PremiumPhoto from '../components/PremiumPhoto';
import '../pages/CoachPortal.css';

const blank={goal:'',focus:'',days:'',notes:''};
/** Rascunho local de preferências; sem mensagens, coaches conectados ou prescrição. */
export default function PersonalPage(){
 const [userId,setUserId]=useState(null);
 const [draft,setDraft]=useState(blank);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [saved,setSaved]=useState(false);
 useEffect(()=>{
   let alive=true;
   getCurrentUser().then(({data})=>{
     if(!alive)return;
     if(!data?.id)throw new Error('Sem usuário');
     const key=personalBriefKey(data.id);
     let values=null;
     try{values=JSON.parse(localStorage.getItem(key)||'null');}catch{values=null;}
     setUserId(data.id);
     setDraft(sanitizePersonalBrief(values));
   }).catch(()=>{if(alive)setError('Não foi possível carregar sua conta. Tente novamente.');})
   .finally(()=>{if(alive)setLoading(false);});
   return()=>{alive=false;};
 },[]);
 const update=(key,value)=>{setDraft(v=>({...v,[key]:value}));setSaved(false);};
 const store=e=>{
   e.preventDefault();
   const key=personalBriefKey(userId);
   if(!key){setError('Entre na sua conta para salvar.');return;}
   try{localStorage.setItem(key,JSON.stringify(sanitizePersonalBrief(draft)));setSaved(true);setError('');}
   catch{setError('Não foi possível salvar suas preferências neste dispositivo.');}
 };
 return <div className="gg-personal">
   <div className="gg-personal-inner">
     <Link className="gg-personal-back" to="/perfil"><FiArrowLeft aria-hidden="true"/> PERFIL</Link>
     <header className="gg-personal-intro gg-personal-premium-hero">
       <PremiumPhoto scene="gym" decorative priority />
       <span className="gg-personal-kicker"><FiUsers aria-hidden="true"/> ALUNO / MEU ACOMPANHAMENTO</span>
       <h1>MEU PERSONAL<span>.</span></h1>
       <p>Treino, alimentação e metas com seu treinador — somente quando você autorizar.</p>
     </header>
     {!loading&&userId&&<StudentCoachPanel userId={userId}/>}
   <section className="gg-personal-card" aria-labelledby="gg-personal-preferences">
       <div className="gg-personal-card-head"><FiEdit3 aria-hidden="true"/><div>
         <h2 id="gg-personal-preferences">SUA ROTINA</h2>
         <span>Suas preferências, sempre editáveis.</span>
       </div></div>
       {loading?<p role="status">Carregando…</p>:<form className="gg-personal-form" onSubmit={store}>
         <label>OBJETIVO
           <select value={draft.goal} onChange={e=>update('goal',e.target.value)}>
             <option value="">Selecione</option>
             {PERSONAL_GOALS.map(x=><option key={x} value={x}>{x}</option>)}
           </select>
         </label>
         <label>FOCO DO TREINO
           <select value={draft.focus} onChange={e=>update('focus',e.target.value)}>
             <option value="">Selecione</option>
             {PERSONAL_FOCUS.map(x=><option key={x} value={x}>{x==='musculacao'?'Musculação':x==='cardio'?'Cardio':'Misto'}</option>)}
           </select>
         </label>
         <label>DIAS DISPONÍVEIS NA SEMANA
           <select value={draft.days} onChange={e=>update('days',e.target.value)}>
             <option value="">Selecione</option>
             {[1,2,3,4,5,6,7].map(x=><option key={x} value={String(x)}>{x} {x===1?'dia':'dias'}</option>)}
           </select>
         </label>
         <label>OBSERVAÇÕES (OPCIONAL)
           <textarea rows="3" maxLength={280} value={draft.notes} placeholder="Ex.: prefiro treinar à tarde" onChange={e=>update('notes',e.target.value)}/>
         </label>
         {error&&<p role="alert" className="gg-personal-error">{error}</p>}
         {saved&&<p role="status" className="gg-personal-ok"><FiCheckCircle aria-hidden="true"/> Salvo neste dispositivo.</p>}
         <button type="submit" className="gg-personal-save">SALVAR PREFERÊNCIAS <FiCheckCircle aria-hidden="true"/></button>
       </form>}
       {error&&loading&&<p role="alert">{error}</p>}
     </section>
     <aside className="gg-personal-future"><FiLock aria-hidden="true"/><div><strong>CONTROLE E PRIVACIDADE</strong>
       <p>Você decide quando solicitar ou revogar o acompanhamento. Mensagens e planos do personal exigem vínculo ativo; propostas não alteram seu treino sem sua aprovação. <Link to="/login-personal">Sou personal trainer</Link>.</p>
     </div></aside>
   </div>
 </div>;
}
