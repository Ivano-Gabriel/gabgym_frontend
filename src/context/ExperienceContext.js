import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {useLocation} from 'react-router-dom';
import {getCurrentUser,getExperiencePreferences,updateExperiencePreferences} from '../services/apiService';
import i18n from '../i18n';
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
    accountId:null,source:'default',error:'',sessionToken:null});
  const [revision,setRevision]=useState(0);

  useEffect(()=>{
    let alive=true;
    if(!token){
      setState({settings:EXPERIENCE_DEFAULTS,ready:true,accountId:null,source:'default',error:'',sessionToken:token});
      return ()=>{alive=false;};
    }
    setState({settings:EXPERIENCE_DEFAULTS,ready:false,accountId:null,source:'default',error:'',sessionToken:token});
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
          setState({settings,ready:true,accountId:userId,source:'server',error:'',sessionToken:token});
        }catch(error){
          if(!alive)return;
          const fallback=local||EXPERIENCE_DEFAULTS;
          setState({settings:fallback,ready:true,accountId:userId,source:'local',sessionToken:token,
            error:error.response?.status===404?'Preferências ainda não sincronizam neste servidor.':
              'Sem conexão para sincronizar preferências. Suas escolhas locais permanecem disponíveis.'});
        }
      }catch{
        if(alive)setState({settings:EXPERIENCE_DEFAULTS,ready:true,accountId:null,
          source:'default',error:'Não foi possível identificar sua conta.',sessionToken:token});
      }
    })();
    return()=>{alive=false;};
  },[token,revision]);

  useEffect(()=>{
    if(!state.ready||!state.accountId||state.sessionToken!==token)return;
    const language=state.settings.language;
    if(i18n.language!==language)i18n.changeLanguage(language);
    try{localStorage.setItem('gabgym:interface-language',language);}catch{}
  },[state.ready,state.accountId,state.settings.language,state.sessionToken,token]);

    const save=useCallback(async input=>{
    if(!state.accountId||state.sessionToken!==token)throw new Error('Entre na sua conta para salvar preferências.');
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
  },[state.accountId,state.sessionToken,token]);

  const refresh=useCallback(()=>setRevision(old=>old+1),[]);
  const value=useMemo(()=>{const {sessionToken,...publicState}=state;return {...publicState,ready:state.ready&&sessionToken===token,accountId:sessionToken===token?state.accountId:null,save,refresh};},[state,save,refresh,token]);
  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}
