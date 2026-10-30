import React,{useEffect,useState} from 'react';
import {useParams,Link} from 'react-router-dom';
import {FiArrowLeft,FiPlayCircle} from 'react-icons/fi';
import {getExerciseById} from '../services/apiService';
import {resolveExerciseVideo} from '../utils/exerciseVideo';
import LazyLoadVideo from '../components/LazyLoadVideo';
import './ExerciseDetailPage.css';

export default function ExerciseDetailPage(){
 const {exerciseId}=useParams();
 const [exercise,setExercise]=useState(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 useEffect(()=>{
  let alive=true;setLoading(true);setError('');
  getExerciseById(exerciseId).then(({data})=>{if(alive)setExercise(data);})
    .catch(()=>{if(alive)setError('Não encontramos este exercício no catálogo.');})
    .finally(()=>{if(alive)setLoading(false);});
  return()=>{alive=false;};
 },[exerciseId]);
 const video=resolveExerciseVideo(exercise);
 return <main className="gg-exdetail-container">
  <div className="gg-exdetail-card">
   <Link to="/exercise-library" className="gg-exdetail-back-link"><FiArrowLeft aria-hidden="true"/> BIBLIOTECA</Link>
   {loading?<p role="status">Carregando exercício…</p>:error||!exercise?
    <div className="gg-exdetail-empty" role="alert"><h1>EXERCÍCIO INDISPONÍVEL.</h1>
      <p>{error||'Exercício não encontrado.'}</p><Link to="/exercise-library">VOLTAR À BIBLIOTECA</Link></div>:
    <>
      <div className="gg-exdetail-heading"><span>GABGYM / EXECUÇÃO</span><h1>{exercise.name}</h1></div>
      {video?<div className="gg-exdetail-video"><LazyLoadVideo src={video}/></div>:
        <div className="gg-exdetail-no-video"><FiPlayCircle aria-hidden="true"/>
          <span>Este exercício ainda não tem vídeo publicado. Você pode consultar as instruções abaixo.</span></div>}
      <section className="gg-exdetail-description"><h2>COMO EXECUTAR</h2>
        <p>{exercise.description || 'Descrição em preparação. Priorize a execução segura e orientação profissional.'}</p></section>
    </>}
  </div>
 </main>;
}
