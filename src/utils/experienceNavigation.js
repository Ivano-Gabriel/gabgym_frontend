import {normalizeExperience} from './experience';

const sections=[
  {key:'food',to:'/alimentacao',label:'Comer',title:'Alimentação',summary:'Refeições e água'},
  {key:'workout',to:'/treino',label:'Treino',title:'Treinos',summary:'Fichas, séries e cardio'},
  {key:'weight',to:'/perfil',label:'Evolução',title:'Evolução',summary:'Peso, medidas e metas'},
  {key:'coach',to:'/meu-personal',label:'Meu Personal',title:'Meu Personal',summary:'Acompanhamento do treinador'}
];
export function experienceNavigation(input) {
  const state=normalizeExperience(input);
  const available=sections.filter(section=>state[section.key]);
  const primary=[{key:'today',to:'/',label:'Hoje'},...available.slice(0,2).map(x=>({
    key:x.key,to:x.to,label:x.label
  }))];
  const profile={key:'profile',to:'/perfil',label:'Perfil'};
  if(!primary.some(x=>x.to===profile.to))primary.push(profile);
  const menu=available.map(x=>({...x}));
  if(state.mode!=='simple'){
    if(state.workout)menu.push({key:'cardio',to:'/cardio/select',label:'Cardio',title:'Cardio',summary:'Escolha sua atividade'});
    menu.push({key:'goals',to:'/minhas-metas',label:'Metas',title:'Metas',summary:'Seus objetivos'});
    menu.push({key:'library',to:'/biblioteca',label:'Biblioteca',title:'Biblioteca',summary:'Aprenda e pratique'});
  }
  if(state.mode==='complete'){
    menu.push({key:'history',to:'/historico',label:'Histórico',title:'Histórico',summary:'Analise seu progresso'});
    menu.push({key:'records',to:'/registros',label:'Registros',title:'Registros',summary:'Seu diário completo'});
  }
  menu.push({key:'experience',to:'/configuracoes',label:'Personalizar',title:'Personalizar',summary:'Alterar módulos e modo'});
  return {primary,menu,available};
}

export function experienceRouteAllowed(path,input) {
  const state=normalizeExperience(input);
  const at=(...prefixes)=>prefixes.some(prefix=>path.toLowerCase()===prefix||path.toLowerCase().startsWith(prefix+'/'));
  if(at('/alimentacao','/dietas','/biblioteca-alimentos','/diario-alimentar','/diario','/legado/dietas','/legado/diario','/legado/diario-alimentar','/legado/biblioteca-alimentos')&&!state.food)return false;
  if(at('/treino','/training-models','/legado/training-models','/cardio','/plano-de-treino','/exercicios','/routine-generator','/exercise-library','/exercicio')&&!state.workout)return false;
  if(at('/meu-personal')&&!state.coach)return false;
  if(state.mode==='simple'&&at('/training-models','/legado/training-models','/plano-de-treino','/exercicios','/routine-generator','/exercise-library','/exercicio'))return false;
  return true;
}
