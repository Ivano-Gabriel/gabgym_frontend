import React, {useEffect,useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {FiArrowLeft,FiActivity,FiCalendar,FiChevronDown,FiCoffee,FiDroplet,FiRefreshCw} from 'react-icons/fi';
import {getCurrentUser,getDiaryLogs} from '../services/apiService';
import {buildRecentDays,summarizeHistoryDay} from '../utils/historyUtils';
import './HistoryPage.css';

const fmt = n => Number(n).toLocaleString('pt-BR',{maximumFractionDigits:1});
export default function HistoryPage(){
  const [days,setDays]=useState([]);
  const [selected,setSelected]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [revision,setRevision]=useState(0);

  useEffect(()=>{
    let alive=true;
    const load=async()=>{
      setLoading(true);setError('');
      try{
        const {data:user}=await getCurrentUser();
        if(!user?.id) throw new Error('Sem usuário');
        const week=buildRecentDays();
        const results=await Promise.allSettled(week.map(day=>getDiaryLogs(user.id,day.key)));
        if(!alive)return;
        const rows=week.map((day,index)=>({
          ...day,
          status:results[index].status==='fulfilled'?'loaded':'error',
          logs:results[index].status==='fulfilled' && Array.isArray(results[index].value.data)
            ? results[index].value.data : []
        }));
        setDays(rows);
        setSelected(old=>rows.some(d=>d.key===old)?old:rows[0].key);
        if(rows.every(d=>d.status==='error'))setError('Não foi possível carregar os últimos sete dias. Você pode tentar novamente.');
      }catch{
        if(alive)setError('Não foi possível carregar seu histórico. Confira sua conexão.');
      }finally{if(alive)setLoading(false);}
    };
    load();
    return()=>{alive=false;};
  },[revision]);
  const summary=useMemo(()=>{
    const loaded=days.filter(day=>day.status==='loaded');
    return loaded.reduce((total,day)=>{
      const x=summarizeHistoryDay(day.logs);
      total.calories+=x.calories;
      total.water+=x.water;
      total.distanceKm+=x.distanceKm;
      total.activities+=x.activities;
      return total;
    },{calories:0,water:0,distanceKm:0,activities:0});
  },[days]);
  const successful=days.filter(x=>x.status==='loaded').length;

  return <main className="gg-history">
    <div className="gg-history-inner">
      <header className="gg-history-heading">
        <Link to="/perfil" className="gg-history-back"><FiArrowLeft aria-hidden="true"/> PERFIL</Link>
        <span className="gg-history-eyebrow"><FiCalendar aria-hidden="true"/> UM DIA DE CADA VEZ</span>
        <h1>HISTÓRICO<span>.</span></h1>
        <p>Seus últimos sete dias. Dados reais, sem compensar exercício com alimentação.</p>
      </header>
      {loading&&<p className="gg-history-loading" role="status">Carregando seus sete dias…</p>}
      {error&&<div className="gg-history-error" role="alert">{error}
        <button type="button" onClick={()=>setRevision(x=>x+1)}><FiRefreshCw aria-hidden="true"/> TENTAR NOVAMENTE</button>
      </div>}
      {!loading&&successful>0&&<>
        <section className="gg-history-week" aria-label="Resumo da semana">
          <div className="gg-history-week-head">
            <span>RESUMO DOS ÚLTIMOS 7 DIAS</span>
            {successful<7&&<small>{successful} de 7 dias carregados</small>}
          </div>
          <div className="gg-history-stats">
            <div><FiCoffee aria-hidden="true"/><span>ALIMENTAÇÃO</span><strong>{fmt(summary.calories)} <small>kcal</small></strong></div>
            <div><FiDroplet aria-hidden="true"/><span>ÁGUA</span><strong>{fmt(summary.water)} <small>ml</small></strong></div>
            <div><FiActivity aria-hidden="true"/><span>CARDIO</span><strong>{fmt(summary.distanceKm)} <small>km</small></strong></div>
          </div>
          <p>Somatório dos dias carregados. Gasto do treino não altera o total alimentar.</p>
        </section>
        <section className="gg-history-days" aria-label="Dias no histórico">
          <div className="gg-history-section-title"><span>07 DIAS / DETALHES</span><h2>SEUS REGISTROS.</h2></div>
          {days.map(day=>{
            const total=summarizeHistoryDay(day.logs);
            const isOpen=selected===day.key;
            return <article key={day.key} className={'gg-history-day'+(isOpen?' active':'')}>
              <button type="button" className="gg-history-day-toggle"
                aria-expanded={isOpen} aria-controls={'gg-history-day-'+day.key}
                onClick={()=>setSelected(isOpen?null:day.key)}>
                <span className="gg-history-date"><strong>{day.label}</strong><small>{day.dateLabel}</small></span>
                <span className="gg-history-day-total">{day.status==='error'
                  ? 'Não foi possível carregar'
                  : total.entries ? fmt(total.calories)+' kcal · '+fmt(total.water)+' ml'
                  : 'Sem registros'}</span>
                <FiChevronDown aria-hidden="true" className={isOpen?'rotated':''}/>
              </button>
              {isOpen&&<div className="gg-history-day-body" id={'gg-history-day-'+day.key}>
                {day.status==='error'
                  ? <p>Não foi possível carregar este dia. Tente atualizar o histórico.</p>
                  : total.entries===0
                  ? <p>Nenhum registro neste dia.</p>
                  : <>
                    <div className="gg-history-day-metrics">
                      <div><span>ALIMENTAÇÃO</span><b>{fmt(total.calories)} kcal</b></div>
                      <div><span>ÁGUA</span><b>{fmt(total.water)} ml</b></div>
                      <div><span>MOVIMENTO</span><b>{fmt(total.movementCalories)} kcal estimadas</b></div>
                    </div>
                    <ul className="gg-history-loglist">
                      {day.logs.map((log,i)=><li key={log.id||i}>
                        <span>{log.name||({'water':'Água','cardio':'Cardio','exercise':'Treino'}[log.type]||'Registro')}</span>
                        <small>{log.type==='water'?fmt(Math.max(0,Number(log.volume)||0))+' ml':fmt(Math.max(0,Number(log.calories)||0))+' kcal'}</small>
                      </li>)}
                    </ul>
                  </>}
              </div>}
            </article>;
          })}
        </section>
        <div className="gg-history-actions">
          <Link to="/registros">REGISTROS DE HOJE</Link>
          <Link to="/">VOLTAR AO HOJE</Link>
        </div>
      </>}
    </div>
  </main>;
}
