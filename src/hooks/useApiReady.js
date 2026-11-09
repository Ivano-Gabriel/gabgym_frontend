import {useCallback,useEffect,useState} from 'react';
import {ensureApiReady} from '../services/apiService';

/** Render Free hibernates: probe /ping before POST, without silently resubmitting it. */
export function useApiReady() {
 const [revision,setRevision]=useState(0);
 const [state,setState]=useState({status:'checking',attempt:0});
 useEffect(()=>{
   let mounted=true;
   const controller=new AbortController();
   setState({status:'checking',attempt:0});
   Promise.resolve().then(()=>ensureApiReady({
     signal:controller.signal,
     onAttempt:attempt=>{if(mounted)setState({status:'checking',attempt});}
   })).then(ready=>{
     if(mounted)setState(previous=>({status:ready?'ready':'unavailable',attempt:previous.attempt}));
   }).catch(()=>{
     if(mounted)setState(previous=>({status:'unavailable',attempt:previous.attempt}));
   });
   return()=>{mounted=false;controller.abort();};
 },[revision]);
 const retry=useCallback(()=>setRevision(value=>value+1),[]);
 return {...state,ready:state.status==='ready',checking:state.status==='checking',retry};
}
