export const EXPERIENCE_DEFAULTS=Object.freeze({
  mode:'normal',food:true,workout:true,weight:true,coach:true,
  language:'pt',completed:false
});

export const MODULE_KEYS=Object.freeze(['food','workout','weight','coach']);
export const EXPERIENCE_MODES=Object.freeze(['simple','normal','complete']);
export const LANGUAGES=Object.freeze(['pt','en','es','fr']);

export function normalizeExperience(input) {
  const item=input&&typeof input==='object'?input:{};
  return {
    mode:EXPERIENCE_MODES.includes(item.mode)?item.mode:'normal',
    food:typeof item.food==='boolean'?item.food:true,
    workout:typeof item.workout==='boolean'?item.workout:true,
    weight:typeof item.weight==='boolean'?item.weight:true,
    coach:typeof item.coach==='boolean'?item.coach:true,
    language:LANGUAGES.includes(item.language)?item.language:'pt',
    completed:item.completed===true
  };
}

export function validateExperience(input) {
  const state=normalizeExperience(input);
  if(!MODULE_KEYS.some(key=>state[key]))throw new Error('Escolha pelo menos um módulo.');
  return state;
}

export const experienceStorageKey=userId=>'gabgym:experience:'+String(userId);

export function readLocalExperience(userId,storage=localStorage) {
  if(!Number.isSafeInteger(Number(userId))||Number(userId)<=0||!storage)return null;
  try{
    const raw=storage.getItem(experienceStorageKey(userId));
    return raw?normalizeExperience(JSON.parse(raw)):null;
  }catch{return null;}
}

export function writeLocalExperience(userId,input,storage=localStorage) {
  if(!Number.isSafeInteger(Number(userId))||Number(userId)<=0||!storage)
    throw new Error('Conta indisponível.');
  const state=validateExperience(input);
  storage.setItem(experienceStorageKey(userId),JSON.stringify(state));
  return state;
}

export function visibleSections(settings) {
  const state=normalizeExperience(settings);
  return MODULE_KEYS.filter(key=>state[key]);
}

export function experienceGate({student,ready,accountId,completed,path}) {
  if(!student)return 'open';
  if(!ready)return 'loading';
  if(!accountId)return 'unavailable';
  if(path==='/experiencia')return 'onboarding';
  return completed===true?'open':'redirect';
}

export function onboardingProfilePayload(input) {
 const out={};
 if(['male','female'].includes(input.gender))out.gender=input.gender;
 if(['maintain-weight','lose-fat','gain-muscle'].includes(input.objective))out.objective=input.objective;
 for(const [key,min,max] of [['age',13,120],['weight',20,600],['height',100,250]]){
   if(input[key]===undefined||input[key]==='')continue;
   const n=Number(input[key]);
   if(!Number.isFinite(n)||n<min||n>max||(key==='age'&&!Number.isInteger(n)))throw new Error('Invalid measurement');
   out[key]=n;
 }
 return out;
}
