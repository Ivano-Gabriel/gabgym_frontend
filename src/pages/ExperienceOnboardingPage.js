import React,{useEffect,useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {FiArrowRight,FiCheck,FiCoffee,FiTarget,FiUsers,FiActivity} from 'react-icons/fi';
import {useExperience} from '../context/ExperienceContext';
import {normalizeExperience} from '../utils/experience';
import './ExperienceOnboardingPage.css';

const features=[
  {key:'food',icon:FiCoffee,title:'Alimentação e água',detail:'Refeições, calorias e hidratação'},
  {key:'workout',icon:FiActivity,title:'Treinos e cardio',detail:'Séries, fichas, cargas e atividades'},
  {key:'weight',icon:FiTarget,title:'Peso e evolução',detail:'Medidas, histórico e metas'},
  {key:'coach',icon:FiUsers,title:'Meu Personal',detail:'Mensagens e acompanhamento autorizado'}
];
const modes=[
  {key:'simple',title:'SIMPLES',detail:'Poucos botões, um passo por vez'},
  {key:'normal',title:'NORMAL',detail:'Resumo, atalhos e detalhes essenciais'},
  {key:'complete',title:'COMPLETO',detail:'Métricas, histórico e mais ferramentas'}
];

export default function ExperienceOnboardingPage() {
  const experience=useExperience();
  const navigate=useNavigate();
  const location=useLocation();
  const edit=new URLSearchParams(location.search).get('edit')==='1';
  const [draft,setDraft]=useState(normalizeExperience(experience.settings));
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');

  useEffect(()=>{if(experience.ready)setDraft(normalizeExperience(experience.settings));},
    [experience.ready,experience.settings]);

  useEffect(()=>{
    if(experience.ready&&experience.settings.completed&&!edit)
      navigate('/',{replace:true});
  },[experience.ready,experience.settings.completed,edit,navigate]);

  const save=async event=>{
    event.preventDefault();
    if(saving)return;
    setSaving(true);setError('');
    try{
      const outcome=await experience.save({...draft,completed:true});
      if(outcome.source==='local'){
        setMessage('Preferências salvas neste navegador. A sincronização fica disponível quando a API for atualizada.');
      }else navigate('/',{replace:true});
    }catch{
      setError('Não foi possível confirmar as preferências. Verifique sua conexão.');
    }finally{setSaving(false);}
  };

  const skip=async()=>{
    if(saving)return;
    setSaving(true);
    try{
      await experience.save({...experience.settings,completed:true});
      navigate('/',{replace:true});
    }catch{setError('Não foi possível salvar. Tente novamente.');setSaving(false);}
  };
  const select=key=>setDraft(old=>({...old,[key]:!old[key]}));

  return <main className="gg-experience">
    <div className="gg-experience-wrap">
      <header className="gg-experience-hero">
        <span>GABGYM / SUA EXPERIÊNCIA</span>
        <h1>O SEU GABGYM.<br/><em>DO SEU JEITO.</em></h1>
        <p>Escolha só o que importa agora. Você pode mudar tudo depois, sem apagar seus registros.</p>
      </header>
      {!experience.ready?<p role="status">Buscando suas preferências…</p>:
      <form onSubmit={save} className="gg-experience-form">
        {experience.error&&<p role="status" className="gg-experience-warning">{experience.error}</p>}
        {error&&<p role="alert" className="gg-experience-warning">{error}</p>}
        {message&&<p role="status" className="gg-experience-warning">{message}
          <Link to="/"> Continuar para o GabGym</Link></p>}
        <section aria-label="Suas áreas">
          <div className="gg-experience-heading"><span>01 / O QUE FAZ SENTIDO</span><h2>ESCOLHA SUAS ÁREAS.</h2></div>
          <div className="gg-experience-features">
            {features.map(({key,icon:Icon,title,detail})=><label className="gg-experience-feature" key={key}>
              <input type="checkbox" checked={Boolean(draft[key])} disabled={saving}
                onChange={()=>select(key)}/>
              <Icon aria-hidden="true"/><span><strong>{title}</strong><small>{detail}</small></span>
              {draft[key]&&<FiCheck aria-hidden="true"/>}
            </label>)}
          </div>
        </section>
        <section aria-label="Nível de detalhes">
          <div className="gg-experience-heading"><span>02 / QUANTO DETALHE</span><h2>ESCOLHA SEU RITMO.</h2></div>
          <div className="gg-experience-modes">
            {modes.map(item=><label key={item.key} className="gg-experience-mode">
              <input type="radio" name="mode" value={item.key} checked={draft.mode===item.key}
                onChange={()=>setDraft(old=>({...old,mode:item.key}))}/>
              <span><strong>{item.title}</strong><small>{item.detail}</small></span>
            </label>)}
          </div>
        </section>
        <div className="gg-experience-footer">
          <button type="submit" disabled={saving||!features.some(item=>draft[item.key])}>
            {saving?'SALVANDO…':edit?'SALVAR MINHA EXPERIÊNCIA':'COMEÇAR COM ESSA EXPERIÊNCIA'} <FiArrowRight aria-hidden="true"/>
          </button>
          {!edit&&<button type="button" className="gg-experience-skip" disabled={saving} onClick={skip}>PULAR POR ENQUANTO</button>}
        </div>
      </form>}
    </div>
  </main>;
}
