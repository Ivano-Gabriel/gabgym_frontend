import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {FiCheck,FiMessageCircle,FiRefreshCw,FiSend,FiShield,FiUserCheck,FiX} from 'react-icons/fi';
import {getPersonalConnection,requestPersonal,revokePersonal,getPersonalTimeline,
  postPersonalMessage,decidePersonalPlan,getDiaryLogs} from '../services/apiService';
import {dayKey,summarizeDay} from '../utils/nutrition';

const empty={id:null,status:'NONE',coachUsername:null};
/** Portal do aluno: conexão só existe quando o servidor a confirma. */
export default function StudentCoachPanel({userId}) {
  const [connection,setConnection]=useState(empty);
  const [timeline,setTimeline]=useState([]);
  const [diary,setDiary]=useState([]);
  const [username,setUsername]=useState('');
  const [message,setMessage]=useState('');
  const [consent,setConsent]=useState(false);
  const [busy,setBusy]=useState(false);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [revision,setRevision]=useState(0);
  const lock=useRef(false);
  const totals=useMemo(()=>summarizeDay(diary),[diary]);
  const activity=diary.filter(x=>x.type==='exercise'||x.type==='cardio').length;
  const load=useCallback(async()=>{
    setLoading(true);setError('');
    try {
      const [link,diaryResult]=await Promise.all([
        getPersonalConnection(),getDiaryLogs(userId,dayKey()).catch(()=>({data:[]}))
      ]);
      const current=link.data||empty;
      setConnection(current);setDiary(Array.isArray(diaryResult.data)?diaryResult.data:[]);
      if(current.status==='ACTIVE') {
        const entries=await getPersonalTimeline(userId);
        setTimeline(Array.isArray(entries.data)?entries.data:[]);
      }else setTimeline([]);
    } catch {
      setError('Não foi possível abrir o Meu Personal. O servidor pode estar iniciando.');
    } finally {setLoading(false);}
  },[userId]);
  useEffect(()=>{if(userId)load();},[userId,revision,load]);
  const refresh=()=>setRevision(x=>x+1);
  const perform=async(action,ok)=>{
    if(lock.current)return;
    lock.current=true;setBusy(true);setError('');setNotice('');
    try {await action();setNotice(ok);refresh();}
    catch(e){
      const status=e.response?.status;
      setError(status===404?'Personal não encontrado. Confira o nome de usuário.':
        status===409?'Já existe uma solicitação ou vínculo pendente.':
        status===403?'Acesso não permitido. Verifique o vínculo.':
        'Não conseguimos confirmar a ação. Tente atualizar a tela.');
    } finally {lock.current=false;setBusy(false);}
  };
  const sendChecked=async e=>{
    e.preventDefault();
    if(!message.trim()||lock.current)return;
    const content=message.trim();
    await perform(async()=>{await postPersonalMessage(userId,'MESSAGE',content);setMessage('');},'Mensagem enviada.');
  };
  return <section className="gg-coach-student" aria-label="Meu Personal conectado">
    <div className="gg-coach-student-header">
      <div><span>01 / ACOMPANHAMENTO</span><h2>CONEXÃO COM SEU PERSONAL.</h2></div>
      <button type="button" disabled={loading||busy} onClick={refresh} aria-label="Atualizar Meu Personal"><FiRefreshCw aria-hidden="true"/></button>
    </div>
    <p>Você controla quem acompanha sua rotina. Só depois da sua solicitação e da aprovação do profissional os dados são compartilhados.</p>
    {loading&&<p role="status">Consultando seu acompanhamento…</p>}
    {error&&<p className="gg-coach-error" role="alert">{error}</p>}
    {notice&&<p className="gg-coach-notice" role="status">{notice}</p>}
    {!loading&&connection.status==='ACTIVE'&&<>
      <div className="gg-coach-connected"><FiUserCheck aria-hidden="true"/><div>
        <strong>ACOMPANHAMENTO ATIVO</strong><span>Personal: @{connection.coachUsername}</span>
      </div></div>
      <div className="gg-coach-student-summary">
        <Link to="/alimentacao"><span>ALIMENTAÇÃO HOJE</span><strong>{totals.calories.toLocaleString('pt-BR')} kcal</strong></Link>
        <Link to="/alimentacao"><span>ÁGUA HOJE</span><strong>{totals.water.toLocaleString('pt-BR')} ml</strong></Link>
        <Link to="/treino"><span>ATIVIDADES HOJE</span><strong>{activity}</strong></Link>
      </div>
      <div className="gg-coach-thread">
        <h3>CONVERSA E PLANOS</h3>
        {timeline.length===0&&<p>Sem mensagens por enquanto. Escreva para iniciar a conversa.</p>}
        <div className="gg-coach-messages">
          {timeline.map(row=><article key={row.id} className={'gg-coach-message'+(row.mine?' is-mine':'')}>
            <span>{row.mine?'VOCÊ':row.kind==='ALERT'?'ALERTA DO PERSONAL':row.kind==='PLAN'?'PROPOSTA DE TREINO':'PERSONAL'} · {row.kind}</span>
            <p>{row.content}</p>
            {row.kind==='PLAN'&&<div className="gg-coach-decision">
              <strong>{row.status==='PENDING'?'AGUARDANDO SUA APROVAÇÃO':row.status==='APPROVED'?'APROVADO':'RECUSADO'}</strong>
              {row.status==='PENDING'&&<>
                <button type="button" disabled={busy} onClick={()=>perform(
                  ()=>decidePersonalPlan(userId,row.id,'APPROVE'),'Plano aprovado.'
                )}><FiCheck aria-hidden="true"/> APROVAR</button>
                <button type="button" disabled={busy} onClick={()=>perform(
                  ()=>decidePersonalPlan(userId,row.id,'REJECT'),'Plano recusado.'
                )}><FiX aria-hidden="true"/> RECUSAR</button>
              </>}
            </div>}
          </article>)}
        </div>
        <form onSubmit={sendChecked} className="gg-coach-message-form">
          <label>Mensagem para seu personal
            <textarea value={message} maxLength={2000} rows="3" placeholder="Dúvidas, adaptações, como foi o treino…" onChange={e=>setMessage(e.target.value)} required/>
          </label>
          <button type="submit" disabled={busy||!message.trim()}><FiSend aria-hidden="true"/> ENVIAR MENSAGEM</button>
        </form>
      </div>
      <button type="button" className="gg-coach-disconnect" disabled={busy}
        onClick={()=>perform(revokePersonal,'Vínculo revogado. O profissional perdeu acesso aos seus dados.')}>
        <FiShield aria-hidden="true"/> REVOGAR ACESSO DO PERSONAL
      </button>
      <p className="gg-coach-disclaimer">Alertas e mensagens aparecem no aplicativo ao atualizar a tela. Ainda não são notificações push.</p>
    </>}
    {!loading&&connection.status==='PENDING'&&<>
      <div className="gg-coach-connected"><FiMessageCircle aria-hidden="true"/>
        <div><strong>AGUARDANDO ACEITE</strong><span>Solicitação enviada para @{connection.coachUsername}</span></div>
      </div>
      <button type="button" className="gg-coach-disconnect" disabled={busy}
        onClick={()=>perform(revokePersonal,'Solicitação cancelada.')}>CANCELAR SOLICITAÇÃO</button>
    </>}
    {!loading&&['NONE','REVOKED','REJECTED'].includes(connection.status)&&<>
      <div className="gg-coach-connect-banner"><FiShield aria-hidden="true"/>
        <span>{connection.status==='REJECTED'?'A solicitação anterior foi recusada. Você pode tentar outro profissional.':
          'Nenhum profissional tem acesso aos seus registros.'}</span>
      </div>
      <form className="gg-coach-connect-form" onSubmit={e=>{
        e.preventDefault();if(!consent)return;
        perform(async()=>{await requestPersonal(username.trim());setConsent(false);},
          'Solicitação enviada. Aguarde a aprovação.');
      }}>
        <label>Usuário do personal
          <input value={username} maxLength={40} required pattern="[A-Za-z0-9_.\\-]{3,40}"
            placeholder="Ex.: treinador.gab" onChange={e=>setUsername(e.target.value)} />
        </label>
        <label className="gg-coach-consent"><input type="checkbox" checked={consent}
          required onChange={e=>setConsent(e.target.checked)}/>
          <span>Autorizo este personal, após aceitar a solicitação, a visualizar meus dados de alimentação, água, treinos e metas. Posso revogar o acesso a qualquer momento.</span>
        </label>
        <button disabled={busy||!consent} type="submit">SOLICITAR ACOMPANHAMENTO</button>
      </form>
      <p className="gg-coach-disclaimer">Digite o nome de usuário que o profissional informou. O GabGym não disponibiliza uma lista pública de alunos ou profissionais.</p>
    </>}
  </section>;
}
