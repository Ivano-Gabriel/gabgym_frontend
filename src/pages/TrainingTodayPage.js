import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiArrowRight, FiBookOpen, FiClock, FiCompass, FiMapPin, FiTrendingUp, FiZap, FiTarget } from 'react-icons/fi';
import { getCurrentUser, getDiaryLogs } from '../services/apiService';
import { dayKey } from '../utils/nutrition';
import './TrainingTodayPage.css';

const format = value => Number(value).toLocaleString('pt-BR',{maximumFractionDigits:1});
const positive = value => { const n=Number(value); return Number.isFinite(n)&&n>0?n:0; };

/** Consumo alimentar e agua nunca contam como gasto de exercício. */
export const summarizeMovement = logs => {
  const entries=(Array.isArray(logs)?logs:[]).filter(item => ['cardio','exercise'].includes(item.type));
  return {
    entries,
    calories: Math.round(entries.reduce((sum,item)=>sum+positive(item.calories),0)),
    durationSeconds: Math.round(entries.reduce((sum,item)=>sum+positive(item.durationSeconds),0)),
    distanceKm: Math.round(entries.filter(item=>item.type==='cardio').reduce((sum,item)=>sum+positive(item.distanceKm),0)*100)/100
  };
};

export default function TrainingTodayPage(){
  const [logs,setLogs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{
    let alive=true;
    const load=async()=>{
      try{
        const {data:user}=await getCurrentUser();
        if(!user?.id) throw new Error('Não autenticado');
        const response=await getDiaryLogs(user.id,dayKey());
        if(alive)setLogs(Array.isArray(response.data)?response.data:[]);
      }catch{
        if(alive)setError('Não foi possível carregar o movimento de hoje. Seu histórico continua salvo.');
      }finally{ if(alive)setLoading(false); }
    };
    load();
    return()=>{alive=false;};
  },[]);
  const today=useMemo(()=>summarizeMovement(logs),[logs]);
  return (
    <main className="gg-movement">
      <div className="gg-movement-inner">
        <header className="gg-movement-hero">
          <span className="gg-movement-kicker"><FiActivity aria-hidden="true"/> MOVIMENTO / TODOS OS DIAS</span>
          <h1>TREINO <em>+</em> CARDIO<span>.</span></h1>
          <p>Escolha sua atividade. Faça o seu melhor hoje.</p>
        </header>
        <section className="gg-movement-day" aria-labelledby="gg-movement-today">
          <div className="gg-movement-day-title">
            <div><span>SEU PROGRESSO</span><h2 id="gg-movement-today">HOJE.</h2></div>
            <Link to="/registros">VER REGISTROS <FiArrowRight aria-hidden="true"/></Link>
          </div>
          {loading?<p className="gg-movement-message" role="status">Carregando atividades…</p>:error?
            <p className="gg-movement-message gg-movement-error" role="alert">{error}</p>:
            <>
              <div className="gg-movement-stats">
                <div><FiZap aria-hidden="true"/><span>GASTO ESTIMADO</span><strong>{format(today.calories)} <small>kcal</small></strong></div>
                <div><FiClock aria-hidden="true"/><span>TEMPO ATIVO</span><strong>{format(Math.round(today.durationSeconds/60))} <small>min</small></strong></div>
                <div><FiMapPin aria-hidden="true"/><span>DISTÂNCIA</span><strong>{format(today.distanceKm)} <small>km</small></strong></div>
              </div>
              {today.entries.length ?
                <div className="gg-movement-last">
                  <FiTrendingUp aria-hidden="true"/>
                  <span>{today.entries.length} atividade{today.entries.length!==1?'s':''} registrada{today.entries.length!==1?'s':''} hoje.</span>
                </div>:
                <p className="gg-movement-empty">Nenhuma atividade registrada hoje. Comece no seu ritmo.</p>}
            </>
          }
          <p className="gg-movement-note">Gasto calórico é uma estimativa. Não é descontado da alimentação.</p>
        </section>
        <section className="gg-movement-actions" aria-labelledby="gg-movement-start">
          <div className="gg-movement-section-heading"><span>01 / AÇÃO</span><h2 id="gg-movement-start">O QUE VAMOS FAZER?</h2></div>
          <Link className="gg-movement-primary" to="/cardio/select" aria-label="Começar cardio">
            <span className="gg-movement-action-icon"><FiActivity aria-hidden="true"/></span>
            <span><strong>COMEÇAR CARDIO</strong><small>Corrida, caminhada ou cronômetro</small></span>
            <FiArrowRight aria-hidden="true"/>
          </Link>
          <Link className="gg-movement-secondary" to="/routine-generator" aria-label="Montar rotina">
            <FiTarget aria-hidden="true"/><span><strong>MONTAR ROTINA</strong><small>Seu plano semanal de treinos</small></span><FiArrowRight aria-hidden="true"/>
          </Link>
          <Link className="gg-movement-secondary" to="/exercise-library" aria-label="Abrir biblioteca de exercícios">
            <FiBookOpen aria-hidden="true"/><span><strong>BIBLIOTECA DE EXERCÍCIOS</strong><small>Encontre movimentos e execução</small></span><FiArrowRight aria-hidden="true"/>
          </Link>
        </section>
        <div className="gg-movement-bottom"><FiCompass aria-hidden="true"/> CONSTÂNCIA ACIMA DE PERFEIÇÃO.</div>
      </div>
    </main>
  );
}
