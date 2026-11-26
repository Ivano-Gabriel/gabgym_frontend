import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {useLocation} from 'react-router-dom';
import {getCurrentUser,getExperiencePreferences,updateExperiencePreferences} from '../services/apiService';
import {EXPERIENCE_DEFAULTS,normalizeExperience,readLocalExperience,
  validateExperience,writeLocalExperience} from '../utils/experience';

const ExperienceContext=createContext({
  settings:EXPERIENCE_DEFAULTS,ready:true,accountId:null,
  source:'default',error:'',save:async()=>{},refresh:()=>{}
});

export const useExperience=()=>useContext(ExperienceContext);

export function ExperienceProvider({children}) {
  useLocation();
  const token=sessionStorage.getItem('authToken')||'';
  const [state,setState]=useState({settings:EXPERIENCE_DEFAULTS,ready:false,
    accountId:null,source:'default',error:''});
  const [revision,setRevision]=useState(0);

  useEffect(()=>{
    let alive=true;
    if(!token){
      setState({settings:EXPERIENCE_DEFAULTS,ready:true,accountId:null,source:'default',error:''});
      return ()=>{alive=false;};
    }
    setState(previous=>({...previous,ready:false}));
    (async()=>{
      try{
        const me=await getCurrentUser();
        if(!alive)return;
        const userId=me.data?.id;
        if(!userId)throw new Error('Perfil indisponível');
        const local=readLocalExperience(userId);
        try{
          const result=await getExperiencePreferences();
          if(!alive)return;
          const settings=normalizeExperience(result.data);
          setState({settings,ready:true,accountId:userId,source:'server',error:''});
        }catch(error){
          if(!alive)return;
          const fallback=local||EXPERIENCE_DEFAULTS;
          setState({settings:fallback,ready:true,accountId:userId,source:'local',
            error:error.response?.status===404?'Preferências ainda não sincronizam neste servidor.':
              'Sem conexão para sincronizar preferências. Suas escolhas locais permanecem disponíveis.'});
        }
      }catch{
        if(alive)setState({settings:EXPERIENCE_DEFAULTS,ready:true,accountId:null,
          source:'default',error:'Não foi possível identificar sua conta.'});
      }
    })();
    return()=>{alive=false;};
  },[token,revision]);

  const save=useCallback(async input=>{
    if(!state.accountId)throw new Error('Entre na sua conta para salvar preferências.');
    const next=validateExperience(input);
    try{
      const response=await updateExperiencePreferences(next);
      const stored=normalizeExperience(response.data);
      writeLocalExperience(state.accountId,stored);
      setState(previous=>({...previous,settings:stored,source:'server',error:''}));
      return {settings:stored,source:'server'};
    }catch(error){
      if(error.response?.status!==404)throw error;
      const stored=writeLocalExperience(state.accountId,next);
      setState(previous=>({...previous,settings:stored,source:'local',
        error:'Seu servidor ainda não sincroniza preferências. Alterações salvas somente neste navegador.'}));
      return {settings:stored,source:'local'};
    }
  },[state.accountId]);

  const refresh=useCallback(()=>setRevision(old=>old+1),[]);
  const value=useMemo(()=>({...state,save,refresh}),[state,save,refresh]);
  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}
