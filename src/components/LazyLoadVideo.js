import React,{useEffect,useRef,useState} from 'react';
export default function LazyLoadVideo({src}) {
 const ref=useRef(null);
 const [visible,setVisible]=useState(false);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  setFailed(false);
  if(typeof IntersectionObserver==='undefined'){setVisible(true);return undefined;}
  let node=ref.current;
  const obs=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){setVisible(true);obs.disconnect();}
  },{rootMargin:'100px'});
  if(node)obs.observe(node);
  return ()=>obs.disconnect();
 },[src]);
 return <div ref={ref} className="gg-local-video" style={{width:'100%',aspectRatio:'16 / 9',background:'#20282b',borderRadius:12,overflow:'hidden',display:'grid',placeItems:'center'}}>
  {failed?<p role="status" style={{padding:16,color:'#ffd0be',fontSize:12}}>Vídeo não disponível neste dispositivo. Tente outro exercício.</p>:
   visible && src?<video key={src} src={src} controls playsInline preload="metadata" onError={()=>setFailed(true)} style={{width:'100%',height:'100%',display:'block'}} aria-label="Demonstração de exercício"/>:
    <span style={{color:'#d6c5bd',fontSize:12}}>Preparando vídeo…</span>}
 </div>;
}
