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
