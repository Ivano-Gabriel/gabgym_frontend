import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {FiActivity,FiArrowRight,FiBell,FiCheck,FiCoffee,
  FiDroplet,FiRefreshCw,FiSend,FiShield,FiUsers,FiX} from 'react-icons/fi';
import {getCurrentUser,getCoachStudents,decideCoachRequest,getCoachDay,
  getPersonalTimeline,postPersonalMessage,logoutUser} from '../services/apiService';
import PremiumPhoto from '../components/PremiumPhoto';
import './CoachPortal.css';

const kindLabels={MESSAGE:'MENSAGEM',ALERT:'ALERTA INTERNO',PLAN:'PROPOSTA DE TREINO',NOTE:'ANOTAÇÃO PRIVADA'};
const n=v=>Number(v||0).toLocaleString('pt-BR',{maximumFractionDigits:1});

export default function CoachDashboard(){
  const navigate=useNavigate();
  const [profile,setProfile]=useState(null);
  const [students,setStudents]=useState([]);
  const [activeId,setActiveId]=useState(null);
  const [day,setDay]=useState(null);
  const [timeline,setTimeline]=useState([]);
  const [entryKind,setEntryKind]=useState('MESSAGE');
  const [entryText,setEntryText]=useState('');
  const [date,setDate]=useState('');
  const [loading,setLoading]=useState(true);
  const [detailLoading,setDetailLoading]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [revision,setRevision]=useState(0);
  const lock=useRef(false);
  const selected=students.find(s=>s.id===activeId&&s.status==='ACTIVE');
  const active=useMemo(()=>students.filter(s=>s.status==='ACTIVE'),[students]);
  const pending=useMemo(()=>students.filter(s=>s.status==='PENDING'),[students]);
  const refresh=()=>setRevision(v=>v+1);

  useEffect(()=>{
    let alive=true;
    setLoading(true);setError('');
    Promise.all([getCurrentUser(),getCoachStudents()]).then(([me,roster])=>{
      if(!alive)return;
      if(me.data?.role!=='PERSONAL')throw new Error('role');
      const list=Array.isArray(roster.data)?roster.data:[];
      setProfile(me.data);setStudents(list);
      setActiveId(value=>list.some(s=>s.id===value&&s.status==='ACTIVE')?value:
        list.find(s=>s.status==='ACTIVE')?.id||null);
    }).catch((error)=>{if(alive)setError(error.response?.status===404
      ? 'A API deste servidor ainda não possui o Portal do Personal.'
      : 'Não foi possível carregar a área profissional. Confira sua conexão e tente novamente.');})
      .finally(()=>{if(alive)setLoading(false);});
    return()=>{alive=false};
  },[revision]);

  const selectedId=selected?.id;
  useEffect(()=>{
    let alive=true;
    if(!selectedId){setDay(null);setTimeline([]);return undefined;}
    setDetailLoading(true);
    Promise.all([getCoachDay(selectedId,date||undefined),getPersonalTimeline(selectedId)])
      .then(([d,t])=>{if(!alive)return;setDay(d.data);setTimeline(Array.isArray(t.data)?t.data:[]);})
      .catch(()=>{if(alive){setError('Não foi possível consultar este aluno. Talvez o vínculo tenha sido revogado.');setDay(null);setTimeline([]);}})
      .finally(()=>{if(alive)setDetailLoading(false);});
    return()=>{alive=false;};
  },[selectedId,date,revision]);

  const submitAction=async(fn,success)=>{
    if(lock.current)return;
    lock.current=true;setBusy(true);setError('');setNotice('');
    try{await fn();setNotice(success);refresh();}
    catch(err){setError(err.response?.status===403?'Acesso negado. O aluno pode ter revogado o vínculo.':
      'Não foi possível confirmar a ação. Atualize a tela antes de tentar novamente.');}
    finally{lock.current=false;setBusy(false);}
  };

  const send=e=>{
    e.preventDefault();
    const content=entryText.trim();
    if(!content||!selectedId)return;
    submitAction(async()=>{await postPersonalMessage(selectedId,entryKind,content);setEntryText('');},
      'Registro enviado para o acompanhamento.');
  };
  const exit=async()=>{
    try{await logoutUser();}catch{/* o método limpa a sessão no finally */}
    navigate('/login-personal',{replace:true});
  };

  return <main className="gg-coach-portal">
    <div className="gg-coach-wrap">
      <header className="gg-coach-hero">
        <PremiumPhoto scene="strength" decorative priority />
        <div className="gg-coach-hero-copy">
          <span>GABGYM / ÁREA PROFISSIONAL</span>
          <h1>ACOMPANHE.<br/><em>EVOLUA.</em></h1>
          <p>Seus alunos, treinos, refeições, metas e comunicação com consentimento.</p>
          <div className="gg-coach-hero-actions">
            <button type="button" onClick={refresh} disabled={loading||busy}><FiRefreshCw aria-hidden="true"/> ATUALIZAR</button>
            <button type="button" onClick={exit}><FiShield aria-hidden="true"/> SAIR DA ÁREA</button>
          </div>
        </div>
      </header>
      {loading&&<div className="gg-coach-notice" role="status">Carregando painel do personal…</div>}
      {error&&<div className="gg-coach-error" role="alert">{error}
        <button type="button" onClick={refresh} disabled={busy||loading}>TENTAR NOVAMENTE</button>
      </div>}
      {notice&&<div className="gg-coach-notice" role="status">{notice}</div>}
      {!loading&&profile&&<>
        <div className="gg-coach-overview">
          <div><FiUsers aria-hidden="true"/><small>ALUNOS ATIVOS</small><strong>{active.length}</strong></div>
          <div><FiBell aria-hidden="true"/><small>SOLICITAÇÕES</small><strong>{pending.length}</strong></div>
          <div><FiShield aria-hidden="true"/><small>PERFIL</small><strong>@{profile.username}</strong></div>
        </div>
        {pending.length>0&&<section className="gg-coach-requests" aria-label="Solicitações de acompanhamento">
          <div className="gg-coach-section-heading"><span>01 / VÍNCULOS PENDENTES</span><h2>CONVITES DE ALUNOS.</h2></div>
          {pending.map(s=><div className="gg-coach-request" key={s.id}>
            <span><strong>{s.name||s.username}</strong><small>@{s.username} solicitou acompanhamento</small></span>
            <button type="button" disabled={busy} onClick={()=>submitAction(
              ()=>decideCoachRequest(s.id,'ACCEPT'),'Aluno aprovado.'
            )}><FiCheck aria-hidden="true"/> ACEITAR</button>
            <button type="button" disabled={busy} className="gg-coach-reject" onClick={()=>submitAction(
              ()=>decideCoachRequest(s.id,'REJECT'),'Solicitação recusada.'
            )}><FiX aria-hidden="true"/> RECUSAR</button>
          </div>)}
        </section>}
        <div className="gg-coach-workspace">
          <aside className="gg-coach-roster" aria-label="Alunos vinculados">
            <div className="gg-coach-section-heading"><span>02 / SUA EQUIPE</span><h2>ALUNOS.</h2></div>
            {active.length===0&&<p>Nenhum aluno conectado. Compartilhe seu nome de usuário com seus alunos e peça para solicitarem vínculo no Meu Personal.</p>}
            {active.map(student=><button type="button" key={student.id}
              className={'gg-coach-student-option'+(student.id===selectedId?' is-selected':'')}
              onClick={()=>setActiveId(student.id)} aria-pressed={student.id===selectedId}>
              <span><strong>{student.name||student.username}</strong><small>@{student.username}</small></span>
              <FiArrowRight aria-hidden="true"/>
            </button>)}
          </aside>
          <section className="gg-coach-details" aria-label="Acompanhamento do aluno">
            {!selected&&<div className="gg-coach-empty">
              <FiUsers aria-hidden="true"/><h2>ACOMPANHAMENTO COMEÇA COM PERMISSÃO.</h2>
              <p>Selecione um aluno vinculado ou aceite uma solicitação. Nenhum dado é aberto sem autorização.</p>
              <Link to="/login-personal">ENTRAR COMO OUTRO PROFISSIONAL <FiArrowRight aria-hidden="true"/></Link>
            </div>}
            {selected&&<>
              <div className="gg-coach-section-heading"><span>03 / ACOMPANHAMENTO INDIVIDUAL</span>
                <h2>{selected.name||selected.username}</h2>
                <p>@{selected.username}</p>
              </div>
              <div className="gg-coach-date">
                <label>Dia do diário
                  <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
                </label>
                <button type="button" onClick={()=>{setDate('');refresh();}}>HOJE / ATUALIZAR</button>
              </div>
              {detailLoading&&<p role="status">Consultando registros autorizados…</p>}
              {day&&!detailLoading&&<>
                <div className="gg-coach-metrics">
                  <div><FiCoffee aria-hidden="true"/><span>COMIDA DO DIA</span><strong>{n(day.calories)} kcal</strong></div>
                  <div><FiDroplet aria-hidden="true"/><span>ÁGUA</span><strong>{n(day.waterMl)} ml</strong></div>
                  <div><FiActivity aria-hidden="true"/><span>TREINOS / CARDIO</span><strong>{n(day.exercises)}</strong></div>
                </div>
                <div className="gg-coach-details-grid">
                  <div className="gg-coach-panel">
                    <h3>DIÁRIO DO DIA</h3>
                    {day.logs?.length?day.logs.map((row,i)=><div className="gg-coach-row" key={i}>
                      <div><span>{row.type==='food'?'COMIDA':row.type==='water'?'ÁGUA':row.type==='exercise'?'TREINO':'ATIVIDADE'}</span>
                        <strong>{row.name||row.type}</strong></div>
                      <small>{row.type==='water'?n(row.volume)+' ml':row.calories!=null?n(row.calories)+' kcal':'—'}</small>
                    </div>):<p>Sem registros para esta data.</p>}
                  </div>
                  <div className="gg-coach-panel">
                    <h3>METAS DO ALUNO</h3>
                    {day.goals?.length?day.goals.map((goal,i)=><div className="gg-coach-row" key={i}>
                      <strong>{goal.title}</strong><small>{goal.status}</small>
                    </div>):<p>Nenhuma meta cadastrada.</p>}
                  </div>
                </div>
              </>}
              <div className="gg-coach-thread">
                <h3>CONVERSAS, PLANOS E ANOTAÇÕES</h3>
                <p>Mensagens e alertas são internos; ainda não são notificações push. Propostas dependem da aprovação do aluno.</p>
                {timeline.length===0&&<p>Sem mensagens registradas.</p>}
                <div className="gg-coach-messages">
                  {timeline.map(row=><article key={row.id} className={'gg-coach-message'+(row.mine?' is-mine':'')}>
                    <span>{row.mine?'VOCÊ':'ALUNO'} / {kindLabels[row.kind]||row.kind}</span>
                    <p>{row.content}</p>
                    {row.kind==='PLAN'&&<small>PLANO: {row.status==='PENDING'?'AGUARDANDO APROVAÇÃO':row.status==='APPROVED'?'APROVADO':'RECUSADO'}</small>}
                    {row.kind==='NOTE'&&<small>PRIVADA: SOMENTE VOCÊ</small>}
                  </article>)}
                </div>
                <form className="gg-coach-message-form" onSubmit={send}>
                  <label>Tipo de comunicação
                    <select value={entryKind} onChange={e=>setEntryKind(e.target.value)}>
                      {Object.entries(kindLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}
                    </select>
                  </label>
                  <label>{entryKind==='PLAN'?'Proposta de treino para aprovação':
                    entryKind==='NOTE'?'Anotação privada do personal':'Escreva sua mensagem'}
                    <textarea value={entryText} onChange={e=>setEntryText(e.target.value)}
                      rows="4" maxLength={2000} required placeholder="Escreva um texto claro e objetivo…"/>
                  </label>
                  <button type="submit" disabled={busy||!entryText.trim()}>
                    <FiSend aria-hidden="true"/> {busy?'ENVIANDO…':'ENVIAR PARA ACOMPANHAMENTO'}
                  </button>
                </form>
              </div>
            </>}
          </section>
        </div>
      </>}
    </div>
  </main>;
}
