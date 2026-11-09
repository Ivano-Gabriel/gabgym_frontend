import React from 'react';

export default function ApiWakeNotice({connection}) {
 if(connection.ready)return null;
 return <div className="gg-api-wake-notice" role="status" aria-live="polite" style={{
   margin:'12px 0',padding:'13px 15px',border:'1px solid #777',borderRadius:9,
   background:'#26272a',color:'#fff',fontSize:12,lineHeight:1.6
 }}>
   {connection.checking
     ? <span>Conectando ao servidor gratuito… tentativa {connection.attempt||1}. O Render pode demorar a acordar. Você pode preencher o formulário enquanto isso.</span>
     : <><span>O servidor ainda não respondeu. Seus dados não foram reenviados.</span>
       <button type="button" onClick={connection.retry} style={{
         display:'block',marginTop:10,padding:'10px 12px',minHeight:44,
         background:'#b1111b',border:'1px solid #b1111b',borderRadius:8,color:'#fff',fontWeight:800
       }}>TENTAR CONECTAR NOVAMENTE</button></>}
 </div>;
}
